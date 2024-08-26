import Phaser from 'phaser';
import { getGame } from '../lib/server';

let gameDifficulty = 'easy';
let baseSpeed = 200;
let gameMode = 'solo';

export default class ModeSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ModeSelectionScene' });
  }

  preload() {
    this.load.image('wallet', 'assets/wallet.png');
    this.load.image('atmosphere', 'assets/atmosphere.png');
  }

  async create() {
    this.add.image(211, 320, 'atmosphere');

    const gameDifficultyModalHtml = `
      <div id="game-welcome-modal" class="modal">
        <h4>Let's Play</h4>
        
        <button id="play-button">Play</button>
      </div>
    `;
    const gameDifficultyModalContainer = document.createElement('div');
    gameDifficultyModalContainer.innerHTML = gameDifficultyModalHtml;
    document.body.appendChild(gameDifficultyModalContainer);

    // Display the game difficulty modal
    document.getElementById('game-welcome-modal').style.display = 'block';

  
    //?code=sewr32
    const search = new URLSearchParams(window.location.search)
    const code = search.get('code')
    console.log('code', code)
    const game = await getGame(code)
    gameDifficulty = game.difficulty;
    gameMode = game.mode
    baseSpeed = this.getSpeedByDifficulty(gameDifficulty)


    // Initialize competition modal
   //  createCompetitionModal(this);

    document.getElementById('play-button').addEventListener('click', () => {
      this.startGame();
    });
  }

  getSpeedByDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        return 200;
      case 'medium':
        return 300;
      case 'hard':
        return 400;
      default:
        return 200;
    }
  }

  startGame() {
    document.getElementById('game-welcome-modal').style.display = 'none';
    this.scene.start('GameScene', { gameDifficulty, baseSpeed, gameMode });
  }
}
