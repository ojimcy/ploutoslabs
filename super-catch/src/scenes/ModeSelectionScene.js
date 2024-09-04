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
    const search = new URLSearchParams(window.location.search);
    console.log(search)
    gameId = search.get('code');
    userId = parseInt(search.get('userId'));

    console.log({gameId, userId})

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

    document.getElementById('play-button').addEventListener('click', () => {
      this.startGame();
    });
  }

  showNotification(message) {
    alert(message);
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
