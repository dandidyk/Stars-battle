import { OWNER_PLAYER, OWNER_AI } from '../../constants.js';
import { DPR, px } from '../../utils/dpr.js';

const SPEEDS = [0.5, 1, 2];
const SPEED_LABELS = ['0.5x', '1x', '2x'];

export function createHUD(scene) {
  const W   = scene.scale.width;
  const H   = scene.scale.height;
  const pad = Math.round(16 * DPR);
  const style = (color) => ({
    fontSize: px(15),
    fontFamily: 'Arial',
    color,
    stroke: '#000000',
    strokeThickness: Math.round(3 * DPR),
  });

  const speedBtn = scene.add.text(W / 2, H - pad, '1x', {
    fontSize: px(16),
    fontFamily: 'Arial Black, Arial',
    color: '#aabbcc',
    stroke: '#000000',
    strokeThickness: Math.round(3 * DPR),
    backgroundColor: '#11223388',
    padding: { x: Math.round(12 * DPR), y: Math.round(6 * DPR) },
  }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true }).setDepth(10);

  let speedIdx = 1;
  speedBtn.on('pointerdown', () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    scene.gameSpeed = SPEEDS[speedIdx];
    speedBtn.setText(SPEED_LABELS[speedIdx]);
  });

  return {
    playerStars:  scene.add.text(pad, pad,                     '', style('#4fc3f7')),
    playerRoutes: scene.add.text(pad, pad + Math.round(22 * DPR), '', style('#4fc3f7')),
    aiStars:      scene.add.text(W - pad, pad,                     '', { ...style('#ef5350'), align: 'right' }).setOrigin(1, 0),
    aiRoutes:     scene.add.text(W - pad, pad + Math.round(22 * DPR), '', { ...style('#ef5350'), align: 'right' }).setOrigin(1, 0),
    speedBtn,
  };
}

export function updateHUD(hud, stars, routes) {
  const playerStars  = stars.filter(s => s.owner === OWNER_PLAYER).length;
  const aiStars      = stars.filter(s => s.owner === OWNER_AI).length;
  const playerRoutes = routes.filter(r => r.owner === OWNER_PLAYER).length;
  const aiRoutes     = routes.filter(r => r.owner === OWNER_AI).length;

  hud.playerStars.setText(`★ ${playerStars}`);
  hud.playerRoutes.setText(`→ ${playerRoutes}`);
  hud.aiStars.setText(`${aiStars} ★`);
  hud.aiRoutes.setText(`${aiRoutes} ←`);
}
