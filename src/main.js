import Phaser from 'phaser';
import BootScene         from './scenes/BootScene.js';
import StartScene        from './scenes/StartScene.js';
import QuickBattleScene  from './scenes/QuickBattleScene.js';
import GameScene         from './scenes/GameScene/index.js';

const _dpr = Math.min(window.devicePixelRatio || 1, 2);

const game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#0d0d1a',
  scene: [BootScene, StartScene, QuickBattleScene, GameScene],
  scale: {
    mode:       Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom:       _dpr,
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
  game.scale.resize(window.innerWidth, window.innerHeight);
});
