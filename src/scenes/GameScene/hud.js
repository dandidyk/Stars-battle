import { OWNER_PLAYER, OWNER_AI } from '../../constants.js';

export function createHUD(scene) {
  const W   = scene.scale.width;
  const pad = 16;
  const style = (color) => ({
    fontSize: '15px',
    fontFamily: 'Arial',
    color,
    stroke: '#000000',
    strokeThickness: 3,
  });

  return {
    playerStars:  scene.add.text(pad, pad,      '', style('#4fc3f7')),
    playerRoutes: scene.add.text(pad, pad + 22, '', style('#4fc3f7')),
    aiStars:      scene.add.text(W - pad, pad,      '', { ...style('#ef5350'), align: 'right' }).setOrigin(1, 0),
    aiRoutes:     scene.add.text(W - pad, pad + 22, '', { ...style('#ef5350'), align: 'right' }).setOrigin(1, 0),
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
