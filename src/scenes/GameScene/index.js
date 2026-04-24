import Phaser from 'phaser';
import { C, DIFFICULTY, OWNER_NEUTRAL, OWNER_PLAYER, OWNER_AI } from '../../constants.js';
import { createStarfield } from '../../utils/starfield.js';
import { generateStars } from '../../entities/star.js';
import { createShip, createDefender } from '../../entities/ship.js';
import { createRoute, routeIsDead } from '../../entities/route.js';
import { resolveArrival } from '../../combat.js';
import { updateAI } from '../../ai/basicAI.js';
import { setupInput } from './input.js';
import { drawStars, drawShips, drawDrag, drawSelection, drawRoutes } from './draw.js';
import { createHUD, updateHUD } from './hud.js';
import { fxSpark, fxCapture } from './fx.js';
import { createDebugOverlay, updateDebugOverlay, debugLog } from './debug.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.difficulty = data.difficulty || 'normal';
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    createStarfield(this);

    const cfg       = DIFFICULTY[this.difficulty];
    this.stars      = generateStars(W, H, cfg.stars);
    this.routes     = [];
    this.ships      = [];
    this.phase      = 'playing';
    this.aiTimer    = 0;
    this.aiInterval = cfg.aiInterval;
    this._lastDt    = 0;

    this.dragFrom   = null;
    this.dragPos    = null;
    this.dragMoved  = false;
    this.dragOrigin = null;
    this.swipePath  = null;

    this.routeGfx     = this.add.graphics();
    this.dragGfx      = this.add.graphics();
    this.shipGfx      = this.add.graphics();
    this.starGfx      = this.add.graphics();
    this.selectionGfx = this.add.graphics();
    this.unitLabels   = [];
    this.selectedStar = null;
    this.selPulse     = 0;

    for (const s of this.stars) {
      const lbl = this.add.text(s.x, s.y + s.radius + 14, '', {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#e0e8ff',
        stroke: '#0d0d1a',
        strokeThickness: 3,
      }).setOrigin(0.5, 0);
      this.unitLabels.push(lbl);
    }

    drawStars(this);
    setupInput(this);
    this._hud = createHUD(this);
    createDebugOverlay(this);
  }

  // Thin wrappers so resolveArrival can call scene.fxSpark / scene.fxCapture
  fxSpark(x, y, owner, count)  { fxSpark(this, x, y, owner, count); }
  fxCapture(star, prevOwner)   { fxCapture(this, star, prevOwner); }

  starAt(x, y) {
    for (const s of this.stars) {
      if (Math.hypot(x - s.x, y - s.y) <= s.radius + 8) return s;
    }
    return null;
  }

  _updateRoutes(dt) {
    this.routes = this.routes.filter(r => !routeIsDead(r));
    for (const r of this.routes) {
      r.dispatchTimer = (r.dispatchTimer || 0) - dt;
      if (r.dispatchTimer > 0) continue;
      if (r.fromStar.units >= 2 && r.fromStar.troops.length > 0) {
        if (!r._dispatched) { r._dispatched = true; debugLog(`route dispatch start: ships=${this.ships.length}`); }
        r.fromStar.units -= 1;
        const troop  = r.fromStar.troops.pop();
        const orbitR = r.fromStar.radius * 1.85 * troop.r;
        const sx     = r.fromStar.x + Math.cos(troop.angle) * orbitR * troop.progress;
        const sy     = r.fromStar.y + Math.sin(troop.angle) * orbitR * troop.progress;
        this.ships.push(createShip(r.owner, r.fromStar, r.toStar, sx, sy));
        r.dispatchTimer = 0.12; // max ~8 ships/sec per route
      }
    }
  }

  _interceptAttackers() {
    const INTERCEPT_RANGE = 2.8;
    const snapshot = this.ships.slice();
    let totalSpawned = 0;
    for (const star of this.stars) {
      if (star.owner === 0)            continue; // neutral stars don't intercept
      if (star.troops.length === 0)    continue;
      let spawned = 0;
      for (const ship of snapshot) {
        if (spawned >= 2)                break; // max 2 defenders per star per frame
        if (ship.owner === star.owner)   continue;
        if (ship.type  === 'defender')   continue;
        if (ship._beingIntercepted)      continue;
        const dist = Math.hypot(ship.x - star.x, ship.y - star.y);
        if (dist > star.radius * INTERCEPT_RANGE) continue;

        if (star.troops.length === 0) break;
        const troop  = star.troops.pop();
        star.units   = Math.max(0, star.units - 1);
        ship._beingIntercepted = true;
        spawned++;
        totalSpawned++;

        const orbitR = star.radius * 1.85 * troop.r;
        const sx = star.x + Math.cos(troop.angle) * orbitR * troop.progress;
        const sy = star.y + Math.sin(troop.angle) * orbitR * troop.progress;
        this.ships.push(createDefender(star.owner, star, sx, sy, ship));
      }
    }
    if (totalSpawned > 0) debugLog(`intercept: +${totalSpawned} defenders, total ships=${this.ships.length}`);
  }

  _updateShips(dt) {
    const SHIP_SPEED = 120;
    const alive = [];
    for (const ship of this.ships) {

      if (ship.type === 'defender') {
        const tgt = ship.targetShip;
        if (!tgt || tgt._destroyed) {
          fxSpark(this, ship.x, ship.y, ship.owner, 3);
          continue;
        }
        ship.angle  = Math.atan2(tgt.y - ship.y, tgt.x - ship.x);
        ship.x     += Math.cos(ship.angle) * SHIP_SPEED * 1.35 * dt;
        ship.y     += Math.sin(ship.angle) * SHIP_SPEED * 1.35 * dt;
        if (Math.hypot(ship.x - tgt.x, ship.y - tgt.y) < 6) {
          fxSpark(this, ship.x, ship.y, ship.owner, 6);
          fxSpark(this, tgt.x,  tgt.y,  tgt.owner,  6);
          tgt._destroyed = true;
        } else {
          alive.push(ship);
        }
        continue;
      }

      if (ship._destroyed) {
        fxSpark(this, ship.x, ship.y, ship.owner, 4);
        continue;
      }

      ship.progress += (SHIP_SPEED * dt) / ship.totalDist;
      ship.x = ship.spawnX + (ship.toStar.x - ship.spawnX) * ship.progress;
      ship.y = ship.spawnY + (ship.toStar.y - ship.spawnY) * ship.progress;

      // Attack any non-friendly star the ship physically passes through
      if (!ship._hit) ship._hit = new Set();
      for (const star of this.stars) {
        if (star === ship.toStar)          continue;
        if (star.owner === ship.owner)     continue;
        if (ship._hit.has(star.id))        continue;
        if (Math.hypot(ship.x - star.x, ship.y - star.y) > star.radius) continue;

        ship._hit.add(star.id);
        const dmg = (1 + ship.fromStar.atkLevel * 0.25) / (1 + star.defLevel * 0.25);
        if (star.units > 0) {
          star.units -= dmg;
          if (star.units < 0) { star.hp += star.units; star.units = 0; }
          fxSpark(this, star.x, star.y, ship.owner, 4);
        } else {
          star.hp -= dmg;
          fxSpark(this, star.x, star.y, ship.owner, 6);
        }
        if (star.hp <= 0) {
          const old = star.owner;
          star.owner  = ship.owner;
          star.hp     = Math.min(Math.abs(star.hp), star.maxHp * 0.15);
          star.units  = 0;
          star.troops = [];
          fxCapture(this, star, old);
        }
      }

      if (ship.progress >= 1) {
        resolveArrival(ship, this);
      } else {
        alive.push(ship);
      }
    }
    this.ships = alive;
  }

  _checkWinLose() {
    if (this.phase !== 'playing') return;
    const aiAlive     = this.stars.some(s => s.owner === OWNER_AI)
      || this.ships.some(s => s.owner === OWNER_AI)
      || this.routes.some(r => r.owner === OWNER_AI);
    const playerAlive = this.stars.some(s => s.owner === OWNER_PLAYER)
      || this.ships.some(s => s.owner === OWNER_PLAYER)
      || this.routes.some(r => r.owner === OWNER_PLAYER);
    if (!aiAlive)          this._endGame('win');
    else if (!playerAlive) this._endGame('lose');
  }

  _endGame(result) {
    this.phase = result;
    const W = this.scale.width;
    const H = this.scale.height;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.62);
    overlay.fillRect(0, 0, W, H);

    const isWin = result === 'win';
    const color = isWin ? '#4fc3f7' : '#ef5350';

    this.add.text(W / 2, H * 0.38, isWin ? 'VICTORY' : 'DEFEAT', {
      fontSize: '52px',
      fontFamily: 'Arial Black, Arial',
      color,
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.38 + 76, isWin ? 'Galaxy conquered!' : 'Fleet destroyed', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#aabbcc',
    }).setOrigin(0.5);

    const replay = this.add.text(W / 2, H * 0.62, 'PLAY AGAIN', {
      fontSize: '24px',
      fontFamily: 'Arial Black, Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      backgroundColor: isWin ? '#1a4a6a' : '#6a1a1a',
      padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets:  replay,
      alpha:    { from: 0.65, to: 1 },
      duration: 900,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.easeInOut',
    });

    replay.once('pointerdown', () => {
      this.scene.restart({ difficulty: this.difficulty });
    });
  }

  _syncTroops(star, dt) {
    const MAX_VISUAL = 24;
    const target = Math.min(Math.floor(star.units), MAX_VISUAL);

    // Animate existing troops
    for (const tr of star.troops) {
      tr.angle    += tr.speed * dt;
      tr.progress  = Math.min(1, tr.progress + dt * 1.2); // ~0.8s to reach orbit
    }

    // Spawn new troops emerging from center
    while (star.troops.length < target) {
      star.troops.push({
        angle:    Math.random() * Math.PI * 2,
        progress: 0,
        speed:    0.38 + Math.random() * 0.18,  // slight speed variation
        r:        0.92 + Math.random() * 0.16,  // slight radius variation
      });
    }

    // Remove troops lost in combat — remove from back (they just vanish)
    while (star.troops.length > target) {
      star.troops.pop();
    }
  }

  update(time, delta) {
    const dt = delta / 1000;
    this._lastDt = dt;

    for (const s of this.stars) {
      s.rotation += s.rotSpeed * dt;
      if (s.owner !== OWNER_NEUTRAL) {
        s.units = Math.min(s.units + s.regenRate * dt, s.maxUnits);
        s.hp    = Math.min(s.hp    + s.hpRegen   * dt, s.maxHp);
      }
      this._syncTroops(s, dt);
    }
    this.selPulse += dt;

    if (this.phase === 'playing') {
      this._updateRoutes(dt);
      this._interceptAttackers();
      this._updateShips(dt);
      updateAI(this);
      this._checkWinLose();
    }

    drawRoutes(this);
    drawDrag(this);
    drawShips(this);
    drawStars(this);
    drawSelection(this);
    updateHUD(this._hud, this.stars, this.routes);
    updateDebugOverlay(this);
  }
}
