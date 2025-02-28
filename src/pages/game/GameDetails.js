import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { FaShare } from 'react-icons/fa';

import pltl from '../../assets/images/logo.png';

import './game-details.css';
import { Button } from 'reactstrap';
import { AppContext } from '../../context/AppContext';
import { useCurrentUser } from '../../hooks/telegram';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getGame } from '../../lib/server';
import { openSuperCatchGameConsole } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
function GameDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const [timeLeft, setTimeLeft] = useState(0);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const { gameCode } = useContext(AppContext);

  const [game, setGame] = useState({});

  const onTimeout = async () => {
    const res = await getGame(gameCode);
    setGame(res.game);
    if (res.game.player2Nickname) {
      openGameConsole();
      return;
    }
    // Notify user that the opponent did not join
    // Navigate back to game page
    toast.error('Opponent did not join in time!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
    navigate('/game/super-catch');
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await getGame(gameCode);
        setGame(res.game);
        // if it is a random user game, open console
        if (res.game.type == 'one-vs-one') {
          openGameConsole();
          return;
        }
        setOpponentJoined(!!res.game.player2Nickname);

        const startDate = new Date(res.game.startDate).getTime();
        const now = new Date().getTime();
        const timeDifference = Math.max((startDate - now) / 1000, 0);
        setTimeLeft(Math.floor(timeDifference));
      } catch (error) {
        console.error('Error in getting game', error);
      }
    };

    fetchGame();
  }, [gameCode]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const startDate = new Date(game.startDate).getTime();
      const now = new Date().getTime();
      const timeDifference = Math.max((startDate - now) / 1000, 0);
      return Math.floor(timeDifference);
    };

    const updateTimer = () => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);

      if (timeLeft > 0) {
        const timerId = setTimeout(updateTimer, 1000);
        return () => clearTimeout(timerId);
      } else if (timeLeft === 0) {
        onTimeout();
      }
    };

    updateTimer();
  }, [game.startDate]);

  const copyCodeToClipboard = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      toast.success(t('game.copiedToClipboard'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
    navigate('/game/super-catch/waiting');
  };

  const openGameConsole = () => {
    openSuperCatchGameConsole(gameCode, currentUser.id);
  };

  const share = () => {
    if (gameCode) {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
        gameCode && gameCode
      )}&text=${encodeURIComponent('Let’s play a one-on-one battle! 🎮')}`;
      navigate(telegramUrl);
    }
    navigate('/game/super-catch/waiting');
  };

  return (
    <div className="detail-page">
      <div className="detail-card d-flex justify-content-between align-items-center">
        <div className="user d-flex align-items-center">
          <div className="user-avatar">
            <span>{game.player1Nickname?.charAt(0)}</span>
          </div>

          <span>{game.player1Nickname}</span>
        </div>
        <div className="countdown-timer">
          {timeLeft > 0 ? `${timeLeft} S` : t('game.timeUp')}
        </div>
        <div className="oponent d-flex align-items-center">
          <div className="user-avatar">
            {opponentJoined ? (
              <span>{game.player2Nickname?.charAt(0)}</span>
            ) : (
              'W'
            )}
          </div>
          <div>{opponentJoined ? game.player2Nickname : 'Waiting...'}</div>
        </div>
      </div>

      {/* Reward section */}
      <div className="game-reward d-flex flex-column justify-content-center align-items-center">
        <h6>{t('game.reward')}</h6>
        <div className="amount">
          <img src={pltl} alt="logo" /> +{game.price}
        </div>
      </div>

      <div className="share-code my-4">
        {gameCode && (
          <div className="text-center">
            <h6>{t('game.yourGameCode')}: {gameCode}</h6>
            <div className="code-action">
              <Button className="share-btn" onClick={share}>
                <FaShare /> {t('game.shareCode')}
              </Button>
              <Button className="copy-btn" onClick={copyCodeToClipboard}>
                {t('game.copyCode')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Play button */}
      <div className="buttons-actions">
        <Button className="play-btn" onClick={openGameConsole}>
          {t('game.play')}
        </Button>
      </div>
    </div>
  );
}

GameDetails.propTypes = {
  initiator: PropTypes.shape({
    username: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  opponent: PropTypes.shape({
    username: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  onTimeout: PropTypes.func,
};

export default GameDetails;
