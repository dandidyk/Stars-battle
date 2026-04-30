import Phaser from 'phaser';
import { DPR } from './dpr.js';

export function createStarfield(scene) {
  const W   = scene.scale.width;
  const H   = scene.scale.height;
  const rng = new Phaser.Math.RandomDataGenerator(['stars']);

  for (let i = 0; i < 160; i++) {
    const x     = rng.between(0, W);
    const y     = rng.between(0, H);
    const r     = rng.between(1, 10) < 8 ? 0.8 * DPR : 1.5 * DPR;
    const alpha = rng.realInRange(0.25, 0.85);

    const dot = scene.add.circle(x, y, r, 0xffffff, alpha);

    if (rng.between(1, 100) <= 35) {
      const dur   = rng.between(1800, 4200);
      const delay = rng.between(0, 3000);
      scene.tweens.add({
        targets:  dot,
        alpha:    { from: alpha * 0.25, to: alpha },
        duration: dur,
        delay,
        yoyo:     true,
        repeat:   -1,
        ease:     'Sine.easeInOut',
      });
    }
  }
}
