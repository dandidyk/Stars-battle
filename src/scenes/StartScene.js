import Phaser from 'phaser';
import { createStarfield } from '../utils/starfield.js';

export default class StartScene extends Phaser.Scene {
  constructor() { super('Start'); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    createStarfield(this);

    this.add.text(W / 2, H * 0.18, 'STARS BATTLE', {
      fontSize: '46px',
      fontFamily: 'Arial Black, Arial',
      color: '#4fc3f7',
      stroke: '#0d0d1a',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.18 + 56, 'Conquer the galaxy', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#888899',
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.42, 'SELECT DIFFICULTY', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#556677',
      letterSpacing: 3,
    }).setOrigin(0.5);

    const buttons = [
      { key: 'easy',   label: 'EASY',   sub: '8 stars  ·  slow AI',   color: '#27ae60', bg: 0x0d2b1a },
      { key: 'normal', label: 'NORMAL', sub: '12 stars  ·  medium AI', color: '#4fc3f7', bg: 0x0d1a2b },
      { key: 'hard',   label: 'HARD',   sub: '16 stars  ·  fast AI',  color: '#ef5350', bg: 0x2b0d0d },
    ];

    const btnW   = Math.min(W * 0.72, 300);
    const btnH   = 64;
    const startY = H * 0.50;
    const gap    = 82;

    buttons.forEach((b, i) => {
      const cx = W / 2;
      const cy = startY + i * gap;

      const bg = this.add.graphics();
      bg.fillStyle(b.bg, 0.85);
      bg.fillRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, 12);
      bg.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(b.color).color, 0.6);
      bg.strokeRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, 12);

      this.add.text(cx, cy - 10, b.label, {
        fontSize: '22px',
        fontFamily: 'Arial Black, Arial',
        color: b.color,
      }).setOrigin(0.5);

      this.add.text(cx, cy + 16, b.sub, {
        fontSize: '13px',
        fontFamily: 'Arial',
        color: '#778899',
      }).setOrigin(0.5);

      const zone = this.add.zone(cx, cy, btnW, btnH).setInteractive({ useHandCursor: true });

      zone.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(b.bg, 1);
        bg.fillRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, 12);
        bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(b.color).color, 1);
        bg.strokeRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, 12);
      });

      zone.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(b.bg, 0.85);
        bg.fillRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, 12);
        bg.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(b.color).color, 0.6);
        bg.strokeRoundedRect(cx - btnW / 2, cy - btnH / 2, btnW, btnH, 12);
      });

      zone.on('pointerdown', () => {
        this.scene.start('Game', { difficulty: b.key });
      });
    });

    // Quick Battle button
    const qbY  = startY + buttons.length * gap + 28;
    const qbW  = Math.min(W * 0.72, 300);

    const qbBg = this.add.graphics();
    const drawQB = (hover) => {
      qbBg.clear();
      qbBg.fillStyle(0x1a1a2e, hover ? 0.95 : 0.75);
      qbBg.fillRoundedRect(W / 2 - qbW / 2, qbY - 22, qbW, 44, 10);
      qbBg.lineStyle(hover ? 2 : 1.5, 0x9c88ff, hover ? 0.9 : 0.5);
      qbBg.strokeRoundedRect(W / 2 - qbW / 2, qbY - 22, qbW, 44, 10);
    };
    drawQB(false);

    this.add.text(W / 2, qbY, 'QUICK BATTLE  ⚙', {
      fontSize: '17px',
      fontFamily: 'Arial Black, Arial',
      color: '#9c88ff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const qbZone = this.add.zone(W / 2, qbY, qbW, 44).setInteractive({ useHandCursor: true });
    qbZone.on('pointerover', () => drawQB(true));
    qbZone.on('pointerout',  () => drawQB(false));
    qbZone.on('pointerdown', () => this.scene.start('QuickBattle'));
  }
}
