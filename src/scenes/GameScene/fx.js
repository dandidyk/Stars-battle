import Phaser from 'phaser';
import { C, OWNER_PLAYER, OWNER_AI, OWNER_NEUTRAL } from '../../constants.js';

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

export function fxIntercept(scene, x, y, defOwner, atkOwner) {
  const defColor = defOwner === OWNER_PLAYER ? C.PLAYER : (defOwner === OWNER_AI ? C.AI : C.NEUTRAL);
  const atkColor = atkOwner === OWNER_PLAYER ? C.PLAYER : (atkOwner === OWNER_AI ? C.AI : C.NEUTRAL);

  // White central flash
  const flash = scene.add.circle(x, y, 7, 0xffffff, 1);
  scene.tweens.add({
    targets: flash, scaleX: 0.1, scaleY: 0.1, alpha: 0,
    duration: 140, ease: 'Cubic.easeOut',
    onComplete: () => flash.destroy(),
  });

  // Expanding ring
  const ring = scene.add.graphics();
  ring.lineStyle(2, 0xffffff, 0.85);
  ring.strokeCircle(x, y, 5);
  scene.tweens.add({
    targets: ring, scaleX: 4.5, scaleY: 4.5, alpha: 0,
    duration: 320, ease: 'Cubic.easeOut',
    onComplete: () => ring.destroy(),
  });

  // Defender-color sparks (bigger, faster)
  for (let i = 0; i < 9; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 50 + Math.random() * 70;
    const sz  = 1.5 + Math.random() * 2;
    const dot = scene.add.circle(x, y, sz, defColor, 1);
    scene.tweens.add({
      targets: dot,
      x: x + Math.cos(a) * spd, y: y + Math.sin(a) * spd,
      alpha: 0, scaleX: 0.2, scaleY: 0.2,
      duration: 260 + Math.random() * 200, ease: 'Quad.easeOut',
      onComplete: () => dot.destroy(),
    });
  }

  // Attacker-color sparks (smaller, slower — debris)
  for (let i = 0; i < 6; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 20 + Math.random() * 40;
    const dot = scene.add.circle(x, y, 1.2, atkColor, 0.85);
    scene.tweens.add({
      targets: dot,
      x: x + Math.cos(a) * spd, y: y + Math.sin(a) * spd,
      alpha: 0,
      duration: 180 + Math.random() * 160, ease: 'Quad.easeOut',
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
