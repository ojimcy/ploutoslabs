import { AUTO, Game, Scale } from 'phaser';
import './styles.css';  // Import styles.css
// import ModeSelectionScene from './scenes/ModeSelectionScene';
import GameScene from './scenes/GameScene';
import ModeSelectionScene from './scenes/ModeSelectionScene';

const config = {
  type: AUTO,
  width: 360,
  height: 640,
  scene: [ModeSelectionScene, GameScene],
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};

const game = new Game(config);
console.log(game);

