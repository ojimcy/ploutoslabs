import React, { useEffect } from 'react';
import Phaser from 'phaser';

const PhaserGame = () => {
  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      width: 360,
      height: 640,
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      }
    };

    var game = new Phaser.Game(config);

    var score = 0;
    var lifeline = 10;
    var scoreText;
    var lifelineText;
    var superman;
    var basketHitbox;
    var cursors;
    var gameOver = false;
    var modal;
    var gameTime = 0; // Track the game time to adjust difficulty

    function preload() {
      this.load.image('atmosphere', 'assets/atmosphere.png');
      this.load.image('coin', 'assets/coin.png');
      this.load.image('bumb', 'assets/bumb.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('superman', 'assets/superman.png');
    }

    function create() {
      this.add.image(211, 320, 'atmosphere');

      superman = this.physics.add.image(180, 550, 'superman').setCollideWorldBounds(true);
      superman.setDisplaySize(superman.width * (150 / superman.height), 150); // Scale Superman to max height of 150

      // Enable input and drag for Superman
      superman.setInteractive();
      this.input.setDraggable(superman);

      // eslint-disable-next-line no-unused-vars
      this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
      });

      // Create an invisible hitbox for the basket
      basketHitbox = this.physics.add.image(superman.x, superman.y - 35, null).setOrigin(0.63, 0.5);
      basketHitbox.setDisplaySize(superman.displayWidth * 0.9, 20);
      basketHitbox.body.allowGravity = false; // Disable gravity for the hitbox
      basketHitbox.setVisible(false); // Hide the hitbox

      scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
      lifelineText = this.add.text(16, 48, 'lifeline: 10', { fontSize: '32px', fill: '#000' });

      cursors = this.input.keyboard.createCursorKeys();

      this.time.addEvent({
        delay: 1000,
        callback: increaseDifficulty,
        callbackScope: this,
        loop: true
      });

      this.time.addEvent({
        delay: 500,
        callback: spawnObject,
        callbackScope: this,
        loop: true
      });

      // Create a div element for the modal and hide it initially
      var modalHtml = `
        <div id="game-over-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; text-align: center; border: 2px solid black; z-index: 1000;">
          <h2>Game Over</h2>
          <p id="final-score"></p>
          <button id="play-again-button">Play Again</button>
        </div>
      `;
      var modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalHtml;
      document.body.appendChild(modalContainer);

      // Add event listener to play again button
      var playAgainButton = document.getElementById('play-again-button');
      playAgainButton.addEventListener('click', () => {
        document.getElementById('game-over-modal').style.display = 'none';
        restartGame(this.scene);
      });

      modal = document.getElementById('game-over-modal');
    }

    function update() {
      if (cursors.left.isDown) {
        superman.setVelocityX(-200);
      } else if (cursors.right.isDown) {
        superman.setVelocityX(200);
      } else {
        superman.setVelocityX(0);
      }

      // Update basket hitbox position to follow Superman
      basketHitbox.setPosition(superman.x + 10, superman.y - 35);
    }

    function spawnObject() {
      if (gameOver) {
        return;
      }

      var x = Phaser.Math.Between(50, 310);
      var objectType = Phaser.Math.Between(0, 100);
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

      var baseSpeed = 200 + gameTime * 5; // Increase base speed over time
      object.setDisplaySize(50, object.height * (50 / object.width)); // Scale falling objects to max width of 50
      object.setVelocityY(baseSpeed);

      this.physics.add.overlap(basketHitbox, object, catchObject, null, this);
    }

    function catchObject(basketHitbox, object) {
      if (object.isBomb) {
        lifeline -= 1;
        lifelineText.setText('lifeline: ' + lifeline);
        if (lifeline === 0) {
          gameOver = true;
          this.physics.pause();
          superman.setTint(0xff0000);
          showGameOverModal();
        }
      } else {
        score += object.scoreValue;
        scoreText.setText('score: ' + score);
      }

      object.destroy();
    }

    function increaseDifficulty() {
      gameTime += 1; // Increase game time
    }

    function showGameOverModal() {
      var finalScoreText = document.getElementById('final-score');
      finalScoreText.innerText = 'Your final score is: ' + score;
      modal.style.display = 'block';
    }

    function restartGame(scene) {
      score = 0;
      lifeline = 10;
      gameOver = false;
      gameTime = 0; // Reset game time

      scoreText.setText('score: 0');
      lifelineText.setText('lifeline: 10');
      superman.clearTint();

      scene.restart();
    }

    return () => {
      // Clean up the Phaser game instance when the component unmounts
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" style={{ width: '360px', height: '640px' }} />;
};

export default PhaserGame;
