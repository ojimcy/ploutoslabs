import React, { useContext, useEffect, useState } from 'react';
import './game-summary.css';
import { Container } from 'reactstrap';
import RewardIcon from '../../assets/images/trophy.png';
import coinIcon from '../../assets/images/airdrop-logo.png';
import { AppContext } from '../../context/AppContext';
import { getGame } from '../../lib/server';
import { Link } from 'react-router-dom';

function GameSummaryPage() {
  const { gameCode } = useContext(AppContext);
  const [game, setGame] = useState({});
  const [gameSession, setGameSession] = useState({});

  const rewardAmount = 100000;

  useEffect(() => {
    try {
      const fetchGame = async () => {
        const res = await getGame(gameCode);
        setGame(res.game);
        setGameSession(res.gameSession);
      };

      fetchGame();
    } catch (error) {
      console.error('Error in getting game', error);
    }
  }, []);

  return (
    <div className="victory-page">
      <Container className="victory-content text-center">
        <h1
          className={`result-title ${
            gameSession.isWinner ? 'victory' : 'loss'
          }`}
        >
          {gameSession.isWinner ? 'Victory!' : 'Loss'}
        </h1>

        <div className="reward-section">
          <img src={RewardIcon} alt="Reward" className="reward-icon" />
          <div
            className={`reward-amount ${
              gameSession.isWinner ? 'victory' : 'loss'
            }`}
          >
            {gameSession.isWinner ? '+' : '-'}
            {rewardAmount.toLocaleString()}
          </div>
        </div>

        <div className="game-details mt-4">
          <div className="player-section">
            <div className="player-info">
              <img
                src={coinIcon}
                alt={game.player1Nickname}
                className="player-avatar"
              />
              <span className="player-username">{game.player1Nickname}</span>
              <span className="player-level">{game.player1Score}</span>
            </div>
            <div className="vs">VS</div>
            <div className="player-info">
              <div className="user-avatar">
                <span>{game.player1Nickname.charAt(0)}</span>
              </div>
              <span className="player-username">{game.player2Nickname}</span>
              <span className="player-level">{game.player2Score}</span>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-value">
                {gameSession.isWinner && gameSession.lifeline}
              </span>
              <span className="stat-label">Life</span>
              <span className="stat-value opponent-value">
                {!gameSession.isWinner && gameSession.lifeline}
              </span>
            </div>
          </div>
        </div>

        <div className="action-buttons mt-5">
          <Link to="/" className="sumary-btn exit-btn">
            EXIT
          </Link>
          <Link to="/game/super-catch" className="sumary-btn new-game-btn">
            NEW GAME
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default GameSummaryPage;
