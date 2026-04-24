import Phaser from 'phaser';
import { createStarfield } from '../utils/starfield.js';

const SETTINGS = [
  {
    label:   'MAP SIZE',
    options: ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE'],
    default: 2,
  },
  {
    label:   'AI LEVEL',
    options: ['PASSIVE', 'EASY', 'NORMAL', 'HARD', 'BRUTAL'],
    default: 2,
  },
  {
    label:   'STARTING UNITS',
    options: ['LOW', 'NORMAL', 'HIGH'],
    default: 1,
  },
  {
    label:   'ECONOMY',
    options: ['SLOW', 'NORMAL', 'FAST'],
    default: 1,
  },
];

const SETTING_COLORS = ['#4fc3f7', '#ef5350', '#ffd54f', '#81c784'];

function buildConfig(indices) {
  const mapStars    = [6, 10, 14, 18, 22][indices[0]];
  const aiIntervals = [4000, 2500, 1200, 700, 350];
  const aiRoutes    = [3, 4, 6, 8, 10];
  const unitsMults  = [0.6, 1.2, 2.0];
  const regenMults  = [0.5, 1.0, 2.0];

  return {
    stars:          mapStars,
    aiInterval:     aiIntervals[indices[1]],
    maxAiRoutes:    aiRoutes[indices[1]],
    startUnitsMult: unitsMults[indices[2]],
    regenMult:      regenMults[indices[3]],
  };
}

export default class QuickBattleScene extends Phaser.Scene {
  constructor() { super('QuickBattle'); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    createStarfield(this);

    // Title
    this.add.text(W / 2, H * 0.10, 'QUICK BATTLE', {
      fontSize: '38px',
      fontFamily: 'Arial Black, Arial',
      color: '#4fc3f7',
      stroke: '#0d0d1a',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.10 + 46, 'Configure your battle', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: '#888899',
    }).setOrigin(0.5);

    // Back button
    const back = this.add.text(20, 20, '← BACK', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: '#556677',
      stroke: '#000',
      strokeThickness: 2,
    }).setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setColor('#aabbcc'));
    back.on('pointerout',  () => back.setColor('#556677'));
    back.on('pointerdown', () => this.scene.start('Start'));

    // Selector rows
    this._indices = SETTINGS.map(s => s.default);
    this._valueTexts = [];

    const rowH    = 64;
    const startY  = H * 0.28;
    const rowW    = Math.min(W * 0.85, 360);
    const cx      = W / 2;

    SETTINGS.forEach((s, i) => {
      const cy    = startY + i * (rowH + 14);
      const color = SETTING_COLORS[i];
      const hexC  = Phaser.Display.Color.HexStringToColor(color).color;

      // Row background
      const bg = this.add.graphics();
      bg.fillStyle(0x0a1525, 0.75);
      bg.fillRoundedRect(cx - rowW / 2, cy - rowH / 2, rowW, rowH, 10);
      bg.lineStyle(1, hexC, 0.35);
      bg.strokeRoundedRect(cx - rowW / 2, cy - rowH / 2, rowW, rowH, 10);

      // Label
      this.add.text(cx - rowW / 2 + 16, cy - 10, s.label, {
        fontSize: '11px',
        fontFamily: 'Arial',
        color: color,
        alpha: 0.7,
      });

      // Value text
      const vt = this.add.text(cx, cy + 10, s.options[this._indices[i]], {
        fontSize: '20px',
        fontFamily: 'Arial Black, Arial',
        color: '#e0e8ff',
      }).setOrigin(0.5);
      this._valueTexts.push(vt);

      // Arrow left
      const arrowL = this.add.text(cx - rowW / 2 + 52, cy + 10, '◄', {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: color,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      arrowL.on('pointerover', () => arrowL.setAlpha(1));
      arrowL.on('pointerout',  () => arrowL.setAlpha(0.7));
      arrowL.setAlpha(0.7);
      arrowL.on('pointerdown', () => {
        this._indices[i] = (this._indices[i] - 1 + s.options.length) % s.options.length;
        vt.setText(s.options[this._indices[i]]);
      });

      // Arrow right
      const arrowR = this.add.text(cx + rowW / 2 - 52, cy + 10, '►', {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: color,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      arrowR.on('pointerover', () => arrowR.setAlpha(1));
      arrowR.on('pointerout',  () => arrowR.setAlpha(0.7));
      arrowR.setAlpha(0.7);
      arrowR.on('pointerdown', () => {
        this._indices[i] = (this._indices[i] + 1) % s.options.length;
        vt.setText(s.options[this._indices[i]]);
      });
    });

    // START BATTLE button
    const btnY  = startY + SETTINGS.length * (rowH + 14) + 36;
    const btnW  = Math.min(W * 0.72, 280);

    const startBg = this.add.graphics();
    const drawStartBtn = (hover) => {
      startBg.clear();
      startBg.fillStyle(0x0d2040, hover ? 1 : 0.85);
      startBg.fillRoundedRect(cx - btnW / 2, btnY - 28, btnW, 56, 14);
      startBg.lineStyle(hover ? 2 : 1.5, 0x4fc3f7, hover ? 1 : 0.7);
      startBg.strokeRoundedRect(cx - btnW / 2, btnY - 28, btnW, 56, 14);
    };
    drawStartBtn(false);

    this.add.text(cx, btnY, 'START BATTLE', {
      fontSize: '22px',
      fontFamily: 'Arial Black, Arial',
      color: '#4fc3f7',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const startZone = this.add.zone(cx, btnY, btnW, 56).setInteractive({ useHandCursor: true });
    startZone.on('pointerover', () => drawStartBtn(true));
    startZone.on('pointerout',  () => drawStartBtn(false));
    startZone.on('pointerdown', () => {
      this.scene.start('Game', { config: buildConfig(this._indices) });
    });

    // Pulse tween on START text
    this.tweens.add({
      targets:  startZone,
      alpha:    { from: 0.85, to: 1 },
      duration: 900,
      yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
