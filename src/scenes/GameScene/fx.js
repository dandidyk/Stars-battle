import Phaser from 'phaser';
import { C, OWNER_PLAYER, OWNER_AI } from '../../constants.js';

export function fxSpark(scene, x, y, owner, count) {
  const color = owner === OWNER_PLAYER ? C.PLAYER : (owner === OWNER_AI ? C.AI : C.NEUTRAL);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 50;
    const dot   = scene.add.circle(x, y, 2, color, 0.9);
    scene.tweens.add({
      targets:  dot,
      x:        x + Math.cos(angle) * speed,
      y:        y + Math.sin(angle) * speed,
      alpha:    0,
      duration: 280 + Math.random() * 180,
      ease:     'Quad.easeOut',
      onComplete: () => dot.destroy(),
    });
  }
}

export function fxCapture(scene, star, prevOwner) {
  const color = star.owner === OWNER_PLAYER ? C.PLAYER : C.AI;
  const ring  = scene.add.graphics();
  ring.lineStyle(3, color, 0.9);
  ring.strokeCircle(star.x, star.y, star.radius);
  scene.tweens.add({
    targets:  ring,
    scaleX:   2.8,
    scaleY:   2.8,
    alpha:    0,
    duration: 420,
    ease:     'Quad.easeOut',
    onComplete: () => ring.destroy(),
  });

  fxSpark(scene, star.x, star.y, star.owner, 12);

  if (star.radius >= 28) {
    const intensity = Phaser.Math.Clamp((star.radius - 28) / 10 * 0.006, 0.002, 0.008);
    scene.cameras.main.shake(250, intensity);
  }
}
