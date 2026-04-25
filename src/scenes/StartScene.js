import Phaser from 'phaser';
import { createStarfield } from '../utils/starfield.js';
import { DPR, px } from '../utils/dpr.js';

export default class StartScene extends Phaser.Scene {
  constructor() { super('Start'); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    createStarfield(this);

    this.add.text(W / 2, H * 0.18, 'STARS BATTLE', {
      fontSize: px(46),
      fontFamily: 'Arial Black, Arial',
      color: '#4fc3f7',
      stroke: '#0d0d1a',
      strokeThickness: Math.round(6 * DPR),
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.18 + Math.round(56 * DPR), 'Conquer the galaxy', {
      fontSize: px(18),
      fontFamily: 'Arial',
      color: '#888899',
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.42, 'SELECT DIFFICULTY', {
      fontSize: px(14),
      fontFamily: 'Arial',
      color: '#556677',
      letterSpacing: Math.round(3 * DPR),
    }).setOrigin(0.5);

    const buttons = [
      { key: 'easy',   label: 'EASY',   sub: '8 stars  ·  slow AI',   color: '#27ae60', bg: 0x0d2b1a },
      { key: 'normal', label: 'NORMAL', sub: '12 stars  ·  medium AI', color: '#4fc3f7', bg: 0x0d1a2b },
      { key: 'hard',   label: 'HARD',   sub: '16 stars  ·  fast AI',  color: '#ef5350', bg: 0x2b0d0d },
    ];

    const btnW   = Math.min(W * 0.72, Math.round(300 * DPR));
    const btnH   = Math.round(64 * DPR);
    const startY = H * 0.50;
    const gap    = Math.round(82 * DPR);

    buttons.forEach((b, i) => {
      const cx = W / 2;
      const cy = startY + i * gap;

      const bg = this.add.graphics();
      bg.fillStyle(b.bg, 0.85);
      bg.fillRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, Math.round(12 * DPR));
      bg.lineStyle(1.5 * DPR, Phaser.Display.Color.HexStringToColor(b.color).color, 0.6);
      bg.strokeRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, Math.round(12 * DPR));

      this.add.text(cx, cy - Math.round(10 * DPR), b.label, {
        fontSize: px(22),
        fontFamily: 'Arial Black, Arial',
        color: b.color,
      }).setOrigin(0.5);

      this.add.text(cx, cy + Math.round(16 * DPR), b.sub, {
        fontSize: px(13),
        fontFamily: 'Arial',
        color: '#778899',
      }).setOrigin(0.5);

      const zone = this.add.zone(cx, cy, btnW, btnH).setInteractive({ useHandCursor: true });

      zone.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(b.bg, 1);
        bg.fillRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, Math.round(12 * DPR));
        bg.lineStyle(2 * DPR, Phaser.Display.Color.HexStringToColor(b.color).color, 1);
        bg.strokeRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, Math.round(12 * DPR));
      });

      zone.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(b.bg, 0.85);
        bg.fillRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, Math.round(12 * DPR));
        bg.lineStyle(1.5 * DPR, Phaser.Display.Color.HexStringToColor(b.color).color, 0.6);
        bg.strokeRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, Math.round(12 * DPR));
      });

      zone.on('pointerdown', () => {
        this.scene.start('Game', { difficulty: b.key });
      });
    });

    // Quick Battle button
    const qbY  = startY + buttons.length * gap + Math.round(28 * DPR);
    const qbW  = Math.min(W * 0.72, Math.round(300 * DPR));
    const qbH  = Math.round(44 * DPR);
    const qbR  = Math.round(10 * DPR);

    const qbBg = this.add.graphics();
    const drawQB = (hover) => {
      qbBg.clear();
      qbBg.fillStyle(0x1a1a2e, hover ? 0.95 : 0.75);
      qbBg.fillRoundedRect(W / 2 - qbW / 2, qbY - qbH / 2, qbW, qbH, qbR);
      qbBg.lineStyle(hover ? 2 * DPR : 1.5 * DPR, 0x9c88ff, hover ? 0.9 : 0.5);
      qbBg.strokeRoundedRect(W / 2 - qbW / 2, qbY - qbH / 2, qbW, qbH, qbR);
    };
    drawQB(false);

    this.add.text(W / 2, qbY, 'QUICK BATTLE  ⚙', {
      fontSize: px(17),
      fontFamily: 'Arial Black, Arial',
      color: '#9c88ff',
      stroke: '#000',
      strokeThickness: Math.round(3 * DPR),
    }).setOrigin(0.5);

    const qbZone = this.add.zone(W / 2, qbY, qbW, qbH).setInteractive({ useHandCursor: true });
    qbZone.on('pointerover', () => drawQB(true));
    qbZone.on('pointerout',  () => drawQB(false));
    qbZone.on('pointerdown', () => this.scene.start('QuickBattle'));
  }
}
