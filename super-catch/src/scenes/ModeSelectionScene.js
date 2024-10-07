import { Scene } from 'phaser';
import { getGame } from '../lib/server';
import { wsMessageTypes } from '../lib/wsMessageTypes';
import { initWebsocket, onMessage } from '../lib/ws';

let gameDifficulty = 'easy';
let baseSpeed = 200;
let gameMode = 'solo';
let userId;
let gameId;

export default class ModeSelectionScene extends Scene {
  constructor() {
    super({ key: 'ModeSelectionScene' });
  }

  preload() {
    this.load.image('wallet', 'assets/wallet.png');
    this.load.image('atmosphere', 'assets/atmosphere.jpg');
  }

  async create() {
    this.add.image(211, 320, 'atmosphere');


    // <button id="play-button">Play</button>
    const gameDifficultyModalHtml = `
      <div id="game-welcome-modal" class="modal">
        <h4>Let's Play</h4>
        <p>Waiting for the other player(s) to join</p>
      </div>
    `;
    const gameDifficultyModalContainer = document.createElement('div');
    gameDifficultyModalContainer.innerHTML = gameDifficultyModalHtml;
    document.body.appendChild(gameDifficultyModalContainer);

    // Display the game difficulty modal
    document.getElementById('game-welcome-modal').style.display = 'block';

    //?code=sewr32
    gameId = localStorage.getItem('CURRENT_GAME_ID');
    userId = parseInt(localStorage.getItem('CURRENT_USER_ID'));

    console.log({gameId, userId})

    if(!gameId || !userId) {
      alert('Cannot get game information. Please try agaain')
      history.back();
    }

    try {
      const game = await getGame(gameId);
      gameDifficulty = game.difficulty;
      gameMode = game.mode;
      baseSpeed = this.getSpeedByDifficulty(gameDifficulty);
    } catch (err) {
      console.log(err);
    }

    initWebsocket(gameId, userId);

    onMessage(wsMessageTypes.MessageTypeJoin, (data) => {
      this.showNotification(data.content);
    });

    onMessage(wsMessageTypes.MessageTypeStartGame, (data) => {
      this.startGame(data);
    });

    // document.getElementById('play-button').addEventListener('click', () => {
    //   this.startGame();
    // });
  }

  showNotification(message) {
    console.log(message);
  }

  getSpeedByDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        return 1;
      case 'medium':
        return 120;
      case 'hard':
        return 240;
      default:
        return 1;
    }
  }

  startGame(msg) {
    //msg = {playerIds: [4,8], playerNames: ['tony', 'ojay']}
    document.getElementById('game-welcome-modal').style.display = 'none';
    this.scene.start('GameScene', {
      gameDifficulty,
      baseSpeed,
      gameMode,
      socket: this.socket,
      msg,
      userId,
      gameId,
    });
  }
}
