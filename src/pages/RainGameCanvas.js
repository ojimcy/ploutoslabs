import React, { useContext, useEffect, useRef, useState } from 'react';
import starImageSrc from '../assets/game/star.png';
import bgImage from '../assets/game/atmosphere.png';
import rainLogo from '../assets/game/coin.png';
import bumbImageScr from '../assets/game/bumb.png';
import supermanSrc from '../assets/game/superman.png';
import nextBtnSrc from '../assets/game/next-button.png';
import backBtnSrc from '../assets/game/back-button.png';

import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import Confetti from 'react-confetti';
import { collectGame, getUserByTelegramID } from '../lib/server';
import { useNavigate } from 'react-router-dom';

import './RainGameCanvas.css';
import { useTelegramUser } from '../hooks/telegram';
import { WebappContext } from '../context/telegram';
import TelegramBackButton from '../components/common/TelegramBackButton';

const RainGameCanvas = () => {
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(null);
  const claimModalScoreRef = useRef(null);
  const telegramUser = useTelegramUser();
  const { setUser } = useContext(WebappContext);
  const navigate = useNavigate();
  const [time, setTime] = useState(30);
  const [collected, setCollected] = useState(false);

  let score = 0;

  const [modal, setModal] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (collected) return;

      if (time <= 0) {
        setCollected(true);
        toggleModal();
        clearInterval(interval);

        // setModal(true);
        // setConfetti(true);
        // const amt = parseInt(claimModalScoreRef.current.textContent)
        // score = 0;
        // await collectGame(amt);
        // navigate(-1);
      } else {
        setTime(time);
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    };
  });

  const toggleModal = () => {
    if (modal) {
      collect();
    }
    setModal(!modal);
    if (!modal) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000); // Stop confetti after 3 seconds
    }
  };

  const collect = async () => {
    // toggleModal();
    await collectGame(parseInt(claimModalScoreRef.current.textContent));
    let user = await getUserByTelegramID(telegramUser.id);
    setUser(user);
    navigate(-1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 26;
    canvas.height = window.innerHeight - 95;

    let raindrops = [];
    let iceDrops = [];
    let bumbDrops = [];

    const coinImage = new Image();
    coinImage.src = rainLogo;

    const starImage = new Image();
    starImage.src = starImageSrc;

    const bumbImage = new Image();
    bumbImage.src = bumbImageScr;

    const supermanImage = new Image();
    supermanImage.src = supermanSrc;

    const backgroundImage = new Image();
    backgroundImage.src = bgImage;

    const nextBtnImage = new Image();
    nextBtnImage.src = nextBtnSrc;

    const backBtnImage = new Image();
    backBtnImage.src = backBtnSrc;

    class StarDrop {
      constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
      }

      draw(ctx) {
        ctx.drawImage(starImage, this.x, this.y, this.size, this.size);
      }

      update(ctx) {
        this.y += this.speed;
        if (superman.collected(this.x + this.size / 2, this.y + this.size)) {
          score += 30;
          updateScore();
          showFloatingText('+30', this.x, this.y, '255, 255, 255');
          this.reset(ctx);
        }
        if (this.y - this.size > ctx.canvas.height - 80) {
          this.reset(ctx);
        }
        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }
    }

    class CoinDrop {
      constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
      }

      draw(ctx) {
        ctx.drawImage(coinImage, this.x, this.y, this.size, this.size);
      }

      update(ctx) {
        this.y += this.speed;
        if (superman.collected(this.x + this.size / 2, this.y + this.size)) {
          score += 50;
          updateScore();
          showFloatingText('+50', this.x, this.y, '255, 255, 255');
          this.reset(ctx);
        }
        if (this.y - this.size > ctx.canvas.height - 80) {
          this.reset(ctx);
        }
        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }
    }

    class BumbDrop {
      constructor(x, y, size, baseSpeed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSpeed = baseSpeed;
        this.speed = baseSpeed * 0.25; // Start at 25% of base speed
      }

      draw(ctx) {
        ctx.drawImage(bumbImage, this.x, this.y, this.size, this.size);
      }

      update(ctx) {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // time in seconds
        const speedFactor = Math.min(elapsedTime / 120, 1); // gradually increase to 1 over 120 seconds
        this.speed = this.baseSpeed * (0.25 + 0.75 * speedFactor); // 25% to 100% over 2 minutes

        this.y += this.speed;
        if (superman.collected(this.x + this.size / 2, this.y + this.size)) {
          this.reset(ctx);
          score = 0;
          updateScore();
          showFloatingText(-score, this.x, this.y, '55, 0, 205');
        }
        if (this.y - this.size > ctx.canvas.height - 40) {
          this.reset(ctx);
        }
        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }
    }

    class Superman {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.movingLeft = false;
        this.movingRight = false;
        this.speed = 5;

        this.leftLap = -0.32 * this.size;
        this.rightLap = 0.82 * this.size;
      }

      draw(ctx) {
        ctx.drawImage(supermanImage, this.x, this.y, this.size, this.size);
      }

      update(ctx) {
        if (this.movingLeft) {
          this.x -= this.speed;
          if (this.x < this.leftLap) this.x = this.leftLap;
        }
        if (this.movingRight) {
          this.x += this.speed;
          if (this.x + this.rightLap > ctx.canvas.width)
            this.x = ctx.canvas.width - this.rightLap;
        }
        this.draw(ctx);
      }

      update1(ctx) {
        if (this.movingLeft) {
          this.x -= this.speed;
          if (this.x < 0) this.x = 0;
        }
        if (this.movingRight) {
          this.x += this.speed;
          if (this.x + this.size > ctx.canvas.width)
            this.x = ctx.canvas.width - this.size;
        }
        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }

      collected(x, y) {
        if (y <= this.y + 90 || y > this.y + 100) return false;

        return (
          x >= this.x + 0.32 * this.size &&
          x <= this.x + 0.4 * this.size + this.size / 2
        );
      }
    }

    const superman = new Superman(
      canvas.width / 2 - 125,
      canvas.height - 250,
      250
    );

    let buttons = {};

    const handleMouseDown = (event) => {
      const { offsetX, offsetY } = event;
      console.log(offsetX, offsetY);
      console.log(buttons);
      if (
        offsetX >= buttons.leftButton.x &&
        offsetX <= buttons.leftButton.x + buttons.leftButton.width &&
        offsetY >= buttons.leftButton.y &&
        offsetY <= buttons.leftButton.y + buttons.leftButton.height
      ) {
        superman.movingLeft = true;
      }
      if (
        offsetX >= buttons.rightButton.x &&
        offsetX <= buttons.rightButton.x + buttons.rightButton.width &&
        offsetY >= buttons.rightButton.y &&
        offsetY <= buttons.rightButton.y + buttons.rightButton.height
      ) {
        superman.movingRight = true;
      }
    };

    const handleMouseUp = () => {
      superman.movingLeft = false;
      superman.movingRight = false;
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      const { clientX, clientY } = touch;
      const { left, top } = canvas.getBoundingClientRect();
      const offsetX = clientX - left;
      const offsetY = clientY - top;

      if (
        offsetX >= buttons.leftButton.x &&
        offsetX <= buttons.leftButton.x + buttons.leftButton.width &&
        offsetY >= buttons.leftButton.y &&
        offsetY <= buttons.leftButton.y + buttons.leftButton.height
      ) {
        superman.movingLeft = true;
      }
      if (
        offsetX >= buttons.rightButton.x &&
        offsetX <= buttons.rightButton.x + buttons.rightButton.width &&
        offsetY >= buttons.rightButton.y &&
        offsetY <= buttons.rightButton.y + buttons.rightButton.height
      ) {
        superman.movingRight = true;
      }
    };

    const handleTouchEnd = () => {
      superman.movingLeft = false;
      superman.movingRight = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    class FloatingText {
      constructor(text, x, y, color = 'white') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.opacity = 1.0;
        this.color = color;
      }

      update() {
        this.y -= 0.5; // Move text up more slowly
        this.opacity -= 0.01; // Fade out text more slowly
      }

      draw(ctx) {
        if (this.opacity > 0) {
          ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
          ctx.font = '18px Arial';
          ctx.fillText(this.text, this.x, this.y);
        }
      }
    }

    let floatingTexts = [];

    function showFloatingText(text, x, y, color = '255, 255, 255') {
      floatingTexts.push(new FloatingText(text, x, y, color));
    }

    function createStarDrop() {
      const size = Math.random() * 40 + 20;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height - canvas.height;
      const speed = Math.random() * 1 + 2; // Reduced speed
      return new StarDrop(x, y, size, speed);
    }

    function createCoinDrop() {
      const size = Math.random() * 60 + 25;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height - canvas.height;
      const speed = Math.random() * 1 + 3; // Reduced speed
      return new CoinDrop(x, y, size, speed);
    }

    function createBumbDrop() {
      const size = Math.random() * 60 + 25;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height - canvas.height;
      const speed = Math.random() * 1 + 6; // Reduced speed
      return new BumbDrop(x, y, size, speed);
    }

    function updateScore() {
      if (scoreRef.current) {
        scoreRef.current.textContent = `${score.toFixed(1)}`;
      }

      if (
        claimModalScoreRef.current &&
        parseInt(claimModalScoreRef.current.textContent) == 0
      ) {
        claimModalScoreRef.current.textContent = `${score.toFixed(1)}`;
      }
    }

    function drawBackground() {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    function drawControlButtons(ctx, canvas, backBtnImage, nextBtnImage) {
      const buttonSize = 70;
      const y = canvas.height - buttonSize - 10;

      const leftButton = {
        x: 30,
        y: y,
        width: buttonSize,
        height: buttonSize,
      };

      const rightButton = {
        x: canvas.width - buttonSize - 30,
        y: y,
        width: buttonSize,
        height: buttonSize,
      };

      ctx.drawImage(
        backBtnImage,
        leftButton.x,
        leftButton.y,
        buttonSize,
        buttonSize
      );
      ctx.drawImage(
        nextBtnImage,
        rightButton.x,
        rightButton.y,
        buttonSize,
        buttonSize
      );

      return { leftButton, rightButton };
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();

      raindrops.forEach((drop) => drop.update(ctx));
      iceDrops.forEach((drop) => drop.update(ctx));
      bumbDrops.forEach((drop) => drop.update(ctx));

      // Update and draw floating texts
      floatingTexts = floatingTexts.filter((text) => text.opacity > 0);
      floatingTexts.forEach((text) => {
        text.update();
        text.draw(ctx);
      });

      superman.update(ctx);

      buttons = drawControlButtons(ctx, canvas, backBtnImage, nextBtnImage);

      requestAnimationFrame(animate);
    }

    function createInitialStars(count) {
      for (let i = 0; i < count; i++) {
        raindrops.push(createStarDrop());
      }
    }

    function createInitialCoins(count) {
      for (let i = 0; i < count; i++) {
        iceDrops.push(createCoinDrop());
      }
    }

    function createInitialBumbs(count) {
      for (let i = 0; i < count; i++) {
        bumbDrops.push(createBumbDrop());
      }
    }

    coinImage.onload = () => {
      createInitialStars(2);
      createInitialCoins(8);
      createInitialBumbs(1);

      animate();
      updateScore();
    };

    // Ensure the background image is loaded before starting the game
    backgroundImage.onload = () => {
      animate();
    };

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div className="section-wrapper game-section">
      <TelegramBackButton />
      <Container>
        {modal && <Confetti />}
        <div className="d-flex justify-content-between mt-2 mb-2">
          <h1 className="score">
            Score: <span ref={scoreRef}>0</span>
          </h1>

          <p>{time}s</p>
        </div>

        <canvas ref={canvasRef} />
      </Container>

      <Modal
        isOpen={modal}
        toggle={toggleModal}
        className="modal-fade text-center"
        backdrop={'static'}
      >
        <ModalHeader
          className="d-flex justify-content-center"
          toggle={toggleModal}
        >
          Congratulations!{' '}
        </ModalHeader>
        <ModalBody>
          {confetti}
          <p>You earned</p>
          <p className="earned-points">
            +<span ref={claimModalScoreRef}>0</span> RAIN
          </p>
          <p>Keep playing to gather more RAIN!</p>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-center">
          <Button color="primary" onClick={collect}>
            Collect
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RainGameCanvas;
