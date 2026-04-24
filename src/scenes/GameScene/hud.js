import { OWNER_PLAYER, OWNER_AI } from '../../constants.js';

const SPEEDS = [0.5, 1, 2];
const SPEED_LABELS = ['0.5x', '1x', '2x'];

export function createHUD(scene) {
  const W   = scene.scale.width;
  const H   = scene.scale.height;
  const pad = 16;
  const style = (color) => ({
    fontSize: '15px',
    fontFamily: 'Arial',
    color,
    stroke: '#000000',
    strokeThickness: 3,
  });

  const speedBtn = scene.add.text(W / 2, H - pad, '1x', {
    fontSize: '16px',
    fontFamily: 'Arial Black, Arial',
    color: '#aabbcc',
    stroke: '#000000',
    strokeThickness: 3,
    backgroundColor: '#11223388',
    padding: { x: 12, y: 6 },
  }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true }).setDepth(10);

  let speedIdx = 1;
  speedBtn.on('pointerdown', () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    scene.gameSpeed = SPEEDS[speedIdx];
    speedBtn.setText(SPEED_LABELS[speedIdx]);
  });

  return {
    playerStars:  scene.add.text(pad, pad,      '', style('#4fc3f7')),
    playerRoutes: scene.add.text(pad, pad + 22, '', style('#4fc3f7')),
    aiStars:      scene.add.text(W - pad, pad,      '', { ...style('#ef5350'), align: 'right' }).setOrigin(1, 0),
    aiRoutes:     scene.add.text(W - pad, pad + 22, '', { ...style('#ef5350'), align: 'right' }).setOrigin(1, 0),
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
