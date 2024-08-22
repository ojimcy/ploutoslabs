import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { FaShare } from 'react-icons/fa';

import pltl from '../../assets/images/logo.png';

import './game-details.css';
import { Button } from 'reactstrap';
import { AppContext } from '../../context/AppContext';
import { useWebApp } from '../../hooks/telegram';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getGame } from '../../lib/server';

function GameDetails() {
  const webapp = useWebApp();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const { gameCode } = useContext(AppContext);

  const [game, setGame] = useState({});

  const onTimeout = () => {
    // notify user the oppenoe did not join
    // navigate back to game page
  };

  useEffect(() => {
    try {
      const fetchGame = async () => {
        const res = await getGame(gameCode);
        setGame(res.game);
        setOpponentJoined(!!game.player2Nickname);
      };

      fetchGame();
    } catch (error) {
      console.error('Error in getting game', error);
    }
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0 && !opponentJoined) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !opponentJoined) {
      onTimeout();
    }
  }, [timeLeft, opponentJoined, onTimeout]);

  useEffect(() => {
    // Simulate opponent joining
    const checkOpponentJoin = setTimeout(() => {}, 10000);

    return () => clearTimeout(checkOpponentJoin);
  }, []);

  const copyCodeToClipboard = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      toast.success('Code copied to clipboard!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
    navigate('/game/waiting');
  };

  const share = () => {
    if (gameCode) {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
        gameCode && gameCode
      )}&text=${encodeURIComponent('Let’s play a one-on-one battle! 🎮')}`;
      webapp.openTelegramLink(telegramUrl);
    }
    navigate('/game/waiting');
  };

  return (
    <div className="detail-page">
      <div className="detail-card d-flex justify-content-between align-items-center">
        <div className="user d-flex align-items-center">
          <div className="user-avatar">
            <span>{game.player1Nickname.charAt(0)}</span>
          </div>

          <span>{game.player1Nickname}</span>
        </div>
        <div className="countdown-timer">{timeLeft} S</div>
        <div className="oponent d-flex align-items-center">
          <div className="user-avatar">
            {opponentJoined ? (
              <span>{game.player2Nickname.charAt(0)}</span>
            ) : (
              'W'
            )}
          </div>
          <div>{opponentJoined ? game.player2Nickname : 'Waiting...'}</div>
        </div>
      </div>

      {/* Reward section */}
      <div className="game-reward d-flex flex-column justify-content-center align-items-center">
        <h6>Reward</h6>
        <div className="amount">
          <img src={pltl} alt="logo" /> +{game.price}
        </div>
      </div>

      <div className="share-code my-4">
        {gameCode && (
          <div className="text-center">
            <h6>Your Game Code: {gameCode}</h6>
            <div className="code-action">
              <Button className="share-btn" onClick={share}>
                <FaShare /> Share Code
              </Button>
              <Button className="copy-btn" onClick={copyCodeToClipboard}>
                Copy Code
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Play button */}
      <div className="buttons-actions">
        <Button className="play-btn">Play</Button>
      </div>
    </div>
  );
}

GameDetails.propTypes = {
  initiator: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  }).isRequired,
  opponent: PropTypes.shape({
    username: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  onTimeout: PropTypes.func.isRequired,
};

export default GameDetails;
