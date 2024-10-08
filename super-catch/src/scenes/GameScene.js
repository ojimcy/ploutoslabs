import { Math, Scene } from 'phaser';
import { wsMessageTypes } from '../lib/wsMessageTypes';
import { onMessage, wsSend } from '../lib/ws';

let score = 0;
let lifeline = 10;
let walletBalance = 1000;
let ethAddress = '0xc87a86671E0590C2CC7e729FDb96d61550C122F5';
let playersScores = {};
let scoreText = {};
let lifelineText = {};
let walletButton;
let superman;
let basketHitbox;
let cursors;
let gameOver = false;
let modal;
let gameTime = 0;
let baseSpeed = 200;
let backgroundMusic;

export default class GameScene extends Scene {
  constructor() {
    super({ key: 'GameScene' });
    window.addEventListener('beforeunload', () => {
      // this.socket.close();
    });
  }

  init(data) {
    baseSpeed = data.baseSpeed;
    gameTime = data.baseSpeed;
    this.socket = data.socket;
    this.initMsg = data.msg;
    this.userId = data.userId;
    this.gameId = data.gameId;

    onMessage(wsMessageTypes.MessageTypeUpdateScore, (data) => {
      if (scoreText[data.sender]) {
        playersScores[data.sender] = data.score;
        scoreText[data.sender].setText('Score: ' + data.score);
      } else {
        console.log(scoreText, data);
      }
    });

    onMessage(wsMessageTypes.MessageTypeUpdateLifeline, (data) => {
      if (lifelineText[data.sender]) {
        lifelineText[data.sender].setText('Lifeline: ' + data.lifeline);
      } else {
        console.log('lifeline', lifeline, data);
      }
    });

    onMessage(wsMessageTypes.MessageTypeGameEnded, (data) => {
      const game = data.game;
      console.log(game)
      // if (game.winner === this.userId) {
      //   alert('Congratulations! You won')
      // } else {
      //   alert('You lost try again.')
      // }
      this.showFinalScore();
    })
  }

  preload() {
    this.load.image('atmosphere', 'assets/atmosphere.jpg');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('bumb', 'assets/bumb.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('superman', 'assets/superman.png');
    this.load.image('wallet', 'assets/wallet.png');
    this.load.audio('backgroundMusic', 'assets/background-music.mp3');
  }

  create() {
    this.add.image(211, 320, 'atmosphere');

    superman = this.physics.add
      .image(180, 550, 'superman')
      .setCollideWorldBounds(true);
    superman.setDisplaySize(superman.width * (150 / superman.height), 150);

    superman.setInteractive();
    this.input.setDraggable(superman);

    this.input.on('drag', function (pointer, gameObject, dragX) {
      gameObject.x = dragX;
    });

    basketHitbox = this.physics.add
      .image(superman.x, superman.y - 35, null)
      .setOrigin(0.63, 0.5);
    basketHitbox.setDisplaySize(superman.displayWidth * 0.9, 20);
    basketHitbox.body.allowGravity = false;
    basketHitbox.setVisible(false);

    var textStyle = {
      fontSize: '16px',
      fill: '#00ff00',
      fontFamily: '"Press Start 2P"',
    };
    // index score and lifeline by play id
    let y = 16;
    console.log('this.initMsg', this.initMsg);
    for (let i = 0; i < this.initMsg.playerIds.length; i++) {
      if(this.initMsg.playerIds[i] == 0) continue;
      this.add.text(16, y, this.initMsg.playerNames[i], {
        ...textStyle,
        fontSize: '10px',
      });
      y += 16;
      scoreText[this.initMsg.playerIds[i]] = this.add.text(
        16,
        y,
        'Score: 0',
        textStyle
      );
      lifelineText[this.initMsg.playerIds[i]] = this.add.text(
        160,
        y,
        'Lifeline: 10',
        textStyle
      );
      y += 16;
    }

    walletButton = this.add.image(330, 20, 'wallet').setInteractive();
    walletButton.setDisplaySize(-30, -30);

    walletButton.on('pointerdown', () => {
      this.scene.pause();
      backgroundMusic.pause();
      document.getElementById('wallet-modal').style.display = 'block';
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.time.addEvent({
      delay: 1000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 200,
      callback: this.spawnObject,
      callbackScope: this,
      loop: true,
    });

    var gameOverModalHtml = `
      <div id="game-over-modal" class="modal">
        <h2>Game Over</h2>
        <div id="final-score"></div>
        <button id="play-again-button">Play Again</button>
      </div>
    `;
    var gameOverModalContainer = document.createElement('div');
    gameOverModalContainer.innerHTML = gameOverModalHtml;
    document.body.appendChild(gameOverModalContainer);

    var walletModalHtml = `
      <div id="wallet-modal" class="modal">
        <h2>Wallet</h2>
        <p id="wallet-balance">Balance: $${walletBalance}</p>
        <button id="deposit-button">Deposit</button>
        <button id="withdraw-button">Withdraw</button>
        <button id="close-wallet-button">Close</button>
        <div id="deposit-instructions" style="display: none; margin-top: 10px;">
          <p>Send ETH to the following address on the Base network:</p>
          <p id="eth-address">${ethAddress}</p>
          <button id="copy-address-button">Copy Address</button>
        </div>
      </div>
    `;
    var walletModalContainer = document.createElement('div');
    walletModalContainer.innerHTML = walletModalHtml;
    document.body.appendChild(walletModalContainer);

    var withdrawalModalHtml = `
      <div id="withdrawal-modal" class="modal">
        <h2>Withdraw Funds</h2>
        <form id="withdrawal-form">
          <div class="form-group">
            <label for="withdraw-wallet-address">Wallet Address:</label>
            <input type="text" id="withdraw-wallet-address" name="walletAddress" required>
          </div>
          <div class="form-group">
            <label for="withdraw-amount">Amount:</label>
            <input type="number" id="withdraw-amount" name="amount" required>
          </div>
          <button type="submit">Submit</button>
          <button type="button" id="cancel-withdrawal-button">Cancel</button>
        </form>
      </div>
    `;
    var withdrawalModalContainer = document.createElement('div');
    withdrawalModalContainer.innerHTML = withdrawalModalHtml;
    document.body.appendChild(withdrawalModalContainer);

    var closeWalletButton = document.getElementById('close-wallet-button');
    closeWalletButton.addEventListener('click', () => {
      document.getElementById('wallet-modal').style.display = 'none';
      this.scene.resume();
      backgroundMusic.resume();
    });

    var depositButton = document.getElementById('deposit-button');
    depositButton.addEventListener('click', () => {
      document.getElementById('deposit-instructions').style.display = 'block';
    });

    var copyAddressButton = document.getElementById('copy-address-button');
    copyAddressButton.addEventListener('click', () => {
      navigator.clipboard
        .writeText(ethAddress)
        .then(() => {
          alert('Address copied to clipboard');
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    });

    var withdrawButton = document.getElementById('withdraw-button');
    withdrawButton.addEventListener('click', () => {
      document.getElementById('withdrawal-modal').style.display = 'block';
    });

    var cancelWithdrawalButton = document.getElementById(
      'cancel-withdrawal-button'
    );
    cancelWithdrawalButton.addEventListener('click', () => {
      document.getElementById('withdrawal-modal').style.display = 'none';
    });

    var withdrawalForm = document.getElementById('withdrawal-form');
    withdrawalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      var walletAddress = document.getElementById(
        'withdraw-wallet-address'
      ).value;
      var amount = parseFloat(document.getElementById('withdraw-amount').value);
      if (walletAddress && amount > 0 && walletBalance >= amount) {
        walletBalance -= amount;
        document.getElementById('wallet-balance').innerText =
          'Balance: $' + walletBalance;
        alert(`Sent $${amount} to ${walletAddress}`);
        document.getElementById('withdrawal-modal').style.display = 'none';
      } else {
        alert('Invalid wallet address or amount, or insufficient balance');
      }
    });

    var playAgainButton = document.getElementById('play-again-button');
    playAgainButton.addEventListener('click', () => {
      // document.getElementById('game-over-modal').style.display = 'none';
      // this.restartGame();
      location.href = '/game/super-catch'
    });

    modal = document.getElementById('game-over-modal');

    backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
    backgroundMusic.play();
  }

  update() {
    if (cursors.left.isDown) {
      superman.setVelocityX(-200);
    } else if (cursors.right.isDown) {
      superman.setVelocityX(200);
    } else {
      superman.setVelocityX(0);
    }

    basketHitbox.setPosition(superman.x + 10, superman.y - 35);
  }

  increaseDifficulty() {
    gameTime += 1;
  }

  spawnObject() {
    if (gameOver) {
      return;
    }

    var x = Math.Between(50, 310);
    var objectType = Math.Between(0, 100);
    var object;

    if (objectType < 60) {
      object = this.physics.add.image(x, 10, 'star');
      object.scoreValue = 30;
      object.isBomb = false;
    } else if (objectType < 90) {
      object = this.physics.add.image(x, 10, 'coin');
      object.scoreValue = 50;
      object.isBomb = false;
    } else {
      object = this.physics.add.image(x, 10, 'bumb');
      object.isBomb = true;
    }

    object.setDisplaySize(50, object.height * (50 / object.width));
    object.setVelocityY(baseSpeed + gameTime * 5);

    this.physics.add.overlap(
      basketHitbox,
      object,
      this.catchObject,
      null,
      this
    );
  }

  catchObject(_, object) {
    if (object.isBomb) {
      lifeline -= 1;
      // lifelineText[this.userId].setText('Lifeline: ' + lifeline);
      wsSend({
        type: wsMessageTypes.MessageTypeUpdateLifeline,
        lifeline,
        gameId: this.gameId,
        sender: this.userId,
      });
      if (lifeline === 0) {
        gameOver = true;
        this.physics.pause();
        superman.setTint(0xff0000);
        this.showGameOverModal();
        backgroundMusic.stop();
      }
    } else {
      score += object.scoreValue;
      // scoreText[this.userId].setText('Score: ' + score);
      wsSend({
        type: wsMessageTypes.MessageTypeUpdateScore,
        score,
        gameId: this.gameId,
        sender: this.userId,
      });
    }

    object.destroy();
  }

  showGameOverModal() {
    var finalScoreText = document.getElementById('final-score');
    let innerText = 'Your final score is: ' + score;
    finalScoreText.innerHTML = innerText;

    modal.style.display = 'block';
  }

  showFinalScore() {
    var finalScoreText = document.getElementById('final-score');
    let innerText = 'Your final score is: ' + score;
    for (let i = 0; i < this.initMsg.playerIds.length; i++) {
      innerText += `<br/>${this.initMsg.playerNames[i]}: ${
        playersScores[this.initMsg.playerIds[i]]
      }`;
    }

    finalScoreText.innerHTML = innerText;

    modal.style.display = 'block';
  }

  restartGame() {
    score = 0;
    lifeline = 10;
    gameOver = false;
    gameTime = 0;

    scoreText[this.userId].setText('Score: 0');
    lifelineText[this.userId].setText('Lifeline: 10');
    superman.clearTint();

    this.time.removeAllEvents();
    this.time.addEvent({
      delay: 1000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 200,
      callback: this.spawnObject,
      callbackScope: this,
      loop: true,
    });

    backgroundMusic.play();
    this.scene.restart();
  }
}
