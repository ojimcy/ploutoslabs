import React, { useContext, useEffect, useRef, useState } from 'react';
import starImageSrc from '../assets/game/star.png';
import bgImage from '../assets/game/atmosphere.png';
import rainLogo from '../assets/game/coin.png';
import bumbImageScr from '../assets/game/bomb.png';
import supermanSrc from '../assets/game/superman.png';

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
        if (this.y - this.size > ctx.canvas.height - 80) {
          if (superman.collected(this.x, this.y)) {
            score += 30;
            updateScore();
            showFloatingText('+30', this.x, this.y, '255, 255, 255');
          }
          this.reset(ctx);
        }
        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }

      collectedBySuperman(ctx) {
        const burnerWidth = 25;
        const yPosition = ctx.canvas.height - 80;

        const burner1X = ctx.canvas.width * 0.125 - burnerWidth / 2;
        const burner2X = ctx.canvas.width * 0.625 - burnerWidth / 2;

        if (this.y + this.size >= yPosition) {
          if (
            (this.x >= burner1X && this.x <= burner1X + burnerWidth) ||
            (this.x >= burner2X && this.x <= burner2X + burnerWidth)
          ) {
            return true;
          }
        }
        return false;
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
        if (this.y - this.size > ctx.canvas.height - 80) {
          if (superman.collected(this.x, this.y)) {
            score += 50;
            updateScore();
            showFloatingText('+50', this.x, this.y, '255, 255, 255');
          }
          this.reset(ctx);
        }
        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }

      collectedBySuperman(ctx) {
        const burnerWidth = 25;
        const yPosition = ctx.canvas.height - 80;

        const burner1X = ctx.canvas.width * 0.125 - burnerWidth / 2;
        const burner2X = ctx.canvas.width * 0.625 - burnerWidth / 2;

        if (this.y + this.size >= yPosition) {
          if (
            (this.x >= burner1X && this.x <= burner1X + burnerWidth) ||
            (this.x >= burner2X && this.x <= burner2X + burnerWidth)
          ) {
            return true;
          }
        }
        return false;
      }
    }

    class BumbDrop {
      constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
      }

      draw(ctx) {
        ctx.drawImage(bumbImage, this.x, this.y, this.size, this.size);
      }

      update(ctx) {
        this.y += this.speed;
        if (this.y - this.size > ctx.canvas.height - 80) {
          if (superman.collected(this.x, this.y)) {
            window.alert('game over');
            // gameOver();
          }
          this.reset(ctx);
        }
        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }

      collectedBySuperman(ctx) {
        const burnerWidth = 25;
        const yPosition = ctx.canvas.height - 80;

        const burner1X = ctx.canvas.width * 0.125 - burnerWidth / 2;
        const burner2X = ctx.canvas.width * 0.625 - burnerWidth / 2;

        if (this.y + this.size >= yPosition) {
          if (
            (this.x >= burner1X && this.x <= burner1X + burnerWidth) ||
            (this.x >= burner2X && this.x <= burner2X + burnerWidth)
          ) {
            return true;
          }
        }
        return false;
      }
    }

    class Superman {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
      }

      draw(ctx) {
        ctx.drawImage(supermanImage, this.x, this.y, this.size, this.size);
      }

      update(ctx) {
        // this.y += this.speed;

        this.draw(ctx);
      }

      reset(ctx) {
        this.y = -this.size;
        this.x = Math.random() * ctx.canvas.width;
      }

      collected(x, y) {
        if (y > this.y || y < this.y - 20) return false;
        if (x < this.x - 10 || x > this.x + 10) return false;

        return true;
      }
    }

    const superman = new Superman(
      canvas.width / 2 - 150,
      canvas.height - 350,
      350
    );

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
      const size = Math.random() * 65 + 45;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height - canvas.height;
      const speed = Math.random() * 1 + 2; // Reduced speed
      return new StarDrop(x, y, size, speed);
    }

    function createCoinDrop() {
      const size = Math.random() * 140 + 70;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height - canvas.height;
      const speed = Math.random() * 1 + 3; // Reduced speed
      return new CoinDrop(x, y, size, speed);
    }

    function createBumbDrop() {
      const size = Math.random() * 100 + 60;
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

      superman.draw(ctx);

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
