import { C, OWNER_NEUTRAL, OWNER_PLAYER, OWNER_AI } from '../../constants.js';
import { DPR } from '../../utils/dpr.js';

function drawRocket(gfx, x, y, angle, color, size) {
  const c  = Math.cos(angle), s = Math.sin(angle);
  const pc = Math.cos(angle + Math.PI / 2), ps = Math.sin(angle + Math.PI / 2);

  const tip   = { x: x + c  * size * 2.0,  y: y + s  * size * 2.0  };
  const back  = { x: x - c  * size * 1.0,  y: y - s  * size * 1.0  };
  const left  = { x: x + pc * size * 0.55, y: y + ps * size * 0.55 };
  const right = { x: x - pc * size * 0.55, y: y - ps * size * 0.55 };

  gfx.fillStyle(color, 0.95);
  gfx.fillTriangle(tip.x, tip.y, left.x, left.y, back.x, back.y);
  gfx.fillTriangle(tip.x, tip.y, right.x, right.y, back.x, back.y);

  // Bright nose
  gfx.fillStyle(0xffffff, 0.55);
  gfx.fillCircle(tip.x, tip.y, size * 0.28);

  // Exhaust glow
  gfx.fillStyle(0xffffff, 0.30);
  gfx.fillCircle(back.x, back.y, size * 0.42);
}

export function drawStarShape(gfx, s) {
  const R = s.radius;
  const t = s.rotation;

  const colorMap = {
    [OWNER_NEUTRAL]: C.NEUTRAL,
    [OWNER_PLAYER]:  C.PLAYER,
    [OWNER_AI]:      C.AI,
  };
  const color = colorMap[s.owner];

  const dr = Math.floor(((color >> 16) & 0xff) * 0.18);
  const dg = Math.floor(((color >> 8)  & 0xff) * 0.18);
  const db = Math.floor(((color)       & 0xff) * 0.18);
  const darkColor = (dr << 16) | (dg << 8) | db;

  const orbitR = R * 1.85;

  // ── Soft outer glow ──────────────────────────────────────────
  gfx.fillStyle(color, 0.025); gfx.fillCircle(s.x, s.y, R * 5.2);
  gfx.fillStyle(color, 0.06);  gfx.fillCircle(s.x, s.y, R * 3.3);
  gfx.fillStyle(color, 0.13);  gfx.fillCircle(s.x, s.y, R * 2.1);
  gfx.fillStyle(color, 0.26);  gfx.fillCircle(s.x, s.y, R * 1.55);
  gfx.fillStyle(color, 0.44);  gfx.fillCircle(s.x, s.y, R * 1.22);

  // ── Sphere body ───────────────────────────────────────────────
  const hpRatio  = s.hp / s.maxHp;
  const litAlpha = 0.55 + 0.35 * hpRatio;
  const rimAlpha = 0.18 + 0.18 * hpRatio;

  gfx.fillStyle(darkColor, 1);
  gfx.fillCircle(s.x, s.y, R);
  gfx.fillStyle(color, litAlpha);
  gfx.fillCircle(s.x - R * 0.08, s.y - R * 0.12, R * 0.93);
  gfx.lineStyle(R * 0.22, color, rimAlpha); // R is already device-px
  gfx.strokeCircle(s.x, s.y, R * 0.89);

  // ── Specular highlight ────────────────────────────────────────
  gfx.fillStyle(0xffffff, 0.35 * hpRatio);
  gfx.fillCircle(s.x - R * 0.27, s.y - R * 0.29, R * 0.30);
  gfx.fillStyle(0xffffff, 0.70 * hpRatio);
  gfx.fillCircle(s.x - R * 0.31, s.y - R * 0.33, R * 0.13);

  // ── HP arc ────────────────────────────────────────────────────
  if (hpRatio < 0.999) {
    const arcR = R * 1.08;
    gfx.lineStyle(2 * DPR, 0x223344, 0.7);
    gfx.strokeCircle(s.x, s.y, arcR);
    gfx.lineStyle(2 * DPR, color, 0.9);
    gfx.beginPath();
    gfx.arc(s.x, s.y, arcR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hpRatio, false);
    gfx.strokePath();
  }

  // ── Orbiting troops as rockets ────────────────────────────────
  for (const tr of s.troops) {
    const dist   = orbitR * tr.r * (1 - Math.pow(1 - tr.progress, 2.5));
    const px     = s.x + Math.cos(tr.angle) * dist;
    const py     = s.y + Math.sin(tr.angle) * dist;
    // Tangent direction of orbit — rocket faces direction of travel
    const facing = tr.angle + Math.PI / 2 * Math.sign(tr.speed);
    const size   = (1.4 + 2.0 * tr.progress) * DPR;
    const alpha  = 0.3 + 0.65 * tr.progress;

    gfx.setAlpha(alpha);
    drawRocket(gfx, px, py, facing, color, size);
    gfx.setAlpha(1);
  }
}

export function drawStars(scene) {
  scene.starGfx.clear();
  for (const s of scene.stars) {
    drawStarShape(scene.starGfx, s);
  }
  for (let i = 0; i < scene.stars.length; i++) {
    const s = scene.stars[i];
    scene.unitLabels[i].setText(Math.floor(s.units));
    scene.unitLabels[i].setY(s.y + s.radius + Math.round(12 * DPR));
  }
}

export function drawRoutes(scene) {
  const dt = scene._lastDt || 0;
  scene.routeGfx.clear();
  for (const r of scene.routes) {
    let color;
    if (r.reinforce)              color = 0x4caf50;
    else if (r.owner === OWNER_PLAYER) color = C.PLAYER;
    else                          color = C.AI;

    const from = r.fromStar;
    const to   = r.toStar;
    const dx   = to.x - from.x;
    const dy   = to.y - from.y;
    const len  = Math.hypot(dx, dy);
    const ux   = dx / len;
    const uy   = dy / len;

    const x1 = from.x + ux * from.radius;
    const y1 = from.y + uy * from.radius;
    const x2 = to.x   - ux * to.radius;
    const y2 = to.y   - uy * to.radius;

    r.dashOffset = (r.dashOffset || 0) + dt * 40;
    const dashLen = r.reinforce ? 6 : 10;
    const gapLen  = r.reinforce ? 8 : 6;
    const cycle   = dashLen + gapLen;
    const segLen  = Math.hypot(x2 - x1, y2 - y1);
    const offset  = r.dashOffset % cycle;

    scene.routeGfx.lineStyle((r.reinforce ? 1.2 : 1.5) * DPR, color, r.reinforce ? 0.45 : 0.55);
    let pos = -offset;
    while (pos < segLen) {
      const start = Math.max(pos, 0);
      const end   = Math.min(pos + dashLen, segLen);
      if (end > start) {
        scene.routeGfx.beginPath();
        scene.routeGfx.moveTo(x1 + ux * start, y1 + uy * start);
        scene.routeGfx.lineTo(x1 + ux * end,   y1 + uy * end);
        scene.routeGfx.strokePath();
      }
      pos += cycle;
    }
  }
}

export function drawShips(scene) {
  scene.shipGfx.clear();
  const now = Date.now();

  for (const ship of scene.ships) {
    const color = ship.owner === OWNER_PLAYER ? C.PLAYER : C.AI;

    if (ship.type === 'defender') {
      // Trail
      const trail = ship.trail;
      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        scene.shipGfx.lineStyle(1.5 * DPR * t, color, 0.55 * t);
        scene.shipGfx.beginPath();
        scene.shipGfx.moveTo(trail[i - 1].x, trail[i - 1].y);
        scene.shipGfx.lineTo(trail[i].x,     trail[i].y);
        scene.shipGfx.strokePath();
      }

      // Targeting beam to quarry
      const tgt = ship.targetShip;
      if (tgt && !tgt._destroyed) {
        const pulse = 0.18 + 0.12 * Math.sin(now / 80);
        scene.shipGfx.lineStyle(1 * DPR, color, pulse);
        scene.shipGfx.beginPath();
        scene.shipGfx.moveTo(ship.x, ship.y);
        scene.shipGfx.lineTo(tgt.x,  tgt.y);
        scene.shipGfx.strokePath();
      }

      // Defender itself — brighter corona + rocket
      scene.shipGfx.fillStyle(color, 0.25);
      scene.shipGfx.fillCircle(ship.x, ship.y, 7 * DPR);
      drawRocket(scene.shipGfx, ship.x, ship.y, ship.angle, color, 4.2 * DPR);
    } else {
      drawRocket(scene.shipGfx, ship.x, ship.y, ship.angle, color, 3.5 * DPR);
    }
  }
}

export function drawDrag(scene) {
  scene.dragGfx.clear();
  if (!scene.dragFrom || !scene.dragPos || !scene.dragMoved) return;

  const s     = scene.dragFrom;
  const tx    = scene.dragPos.x;
  const ty    = scene.dragPos.y;
  const angle = Math.atan2(ty - s.y, tx - s.x);
  const x1    = s.x + Math.cos(angle) * s.radius;
  const y1    = s.y + Math.sin(angle) * s.radius;

  const dx  = tx - x1;
  const dy  = ty - y1;
  const len = Math.hypot(dx, dy);
  const ux  = dx / len;
  const uy  = dy / len;

  scene.dragGfx.lineStyle(2 * DPR, C.PLAYER, 0.7);
  const dash = 10, gap = 6, cycle = dash + gap;
  let pos = 0;
  while (pos < len) {
    const end = Math.min(pos + dash, len);
    scene.dragGfx.beginPath();
    scene.dragGfx.moveTo(x1 + ux * pos, y1 + uy * pos);
    scene.dragGfx.lineTo(x1 + ux * end, y1 + uy * end);
    scene.dragGfx.strokePath();
    pos += cycle;
  }

  const hitStar  = scene.starAt(tx, ty);
  const dotColor = (hitStar && hitStar !== s) ? C.PLAYER : 0xffffff;
  scene.dragGfx.fillStyle(dotColor, 0.8);
  scene.dragGfx.fillCircle(tx, ty, 5 * DPR);
}

export function drawSelection(scene) {
  scene.selectionGfx.clear();
  if (!scene.selectedStar) return;
  const s     = scene.selectedStar;
  const pulse = 0.7 + 0.3 * Math.sin(scene.selPulse * 4);
  const r     = s.radius * 1.55 + pulse * 4;
  scene.selectionGfx.lineStyle(2 * DPR, C.PLAYER, 0.55 + 0.35 * pulse);
  scene.selectionGfx.strokeCircle(s.x, s.y, r);
  scene.selectionGfx.lineStyle(1 * DPR, C.PLAYER, 0.25);
  scene.selectionGfx.strokeCircle(s.x, s.y, r + 5 * DPR);
}
