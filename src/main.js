import Phaser from 'phaser';
import BootScene         from './scenes/BootScene.js';
import StartScene        from './scenes/StartScene.js';
import QuickBattleScene  from './scenes/QuickBattleScene.js';
import GameScene         from './scenes/GameScene/index.js';

const dpr = window.devicePixelRatio || 1;

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  backgroundColor: '#0d0d1a',
  scene: [BootScene, StartScene, QuickBattleScene, GameScene],
  scale: {
    mode:   Phaser.Scale.NONE,
    width:  Math.round(window.innerWidth  * dpr),
    height: Math.round(window.innerHeight * dpr),
    zoom:   1 / dpr,
  },
  render: {
    antialias: true,
    pixelArt:  false,
  },
  input: {
    activePointers: 3,
  },
});

window.addEventListener('resize', () => {
  const d = window.devicePixelRatio || 1;
  game.scale.resize(
    Math.round(window.innerWidth  * d),
    Math.round(window.innerHeight * d),
  );
  game.canvas.style.width  = window.innerWidth  + 'px';
  game.canvas.style.height = window.innerHeight + 'px';
});
