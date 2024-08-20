import React from 'react';
import './game-summary.css';
import { Container, Button } from 'reactstrap';
import RewardIcon from '../../assets/images/trophy.png';
import coinIcon from '../../assets/images/airdrop-logo.png';

function GameSummaryPage() {
  const player = {
    username: 'clintcrypz',
    score: 15000,
    life: 5,
    result: 'victory',
    avatar: coinIcon,
  };

  const opponent = {
    username: 'emmyjay',
    score: 7500,
    life: 0,
    result: 'lost',
    avatar: coinIcon,
  };

  const rewardAmount = 100000;
  const isVictory = player.result === 'victory';

  return (
    <div className="victory-page">
      <Container className="victory-content text-center">
        <h1 className={`result-title ${isVictory ? 'victory' : 'loss'}`}>
          {isVictory ? 'Victory!' : 'Loss'}
        </h1>

        <div className="reward-section">
          <img src={RewardIcon} alt="Reward" className="reward-icon" />
          <div className={`reward-amount ${isVictory ? 'victory' : 'loss'}`}>
            {isVictory ? '+' : '-'}{rewardAmount.toLocaleString()}
          </div>
        </div>
        
        <div className="game-details mt-4">
          <div className="player-section">
            <div className="player-info">
              <img
                src={player.avatar}
                alt={player.username}
                className="player-avatar"
              />
              <span className="player-username">{player.username}</span>
              <span className="player-level">{player.score}</span>
            </div>
            <div className="vs">VS</div>
            <div className="player-info">
              <img
                src={opponent.avatar}
                alt={opponent.username}
                className="player-avatar"
              />
              <span className="player-username">{opponent.username}</span>
              <span className="player-level">{opponent.score}</span>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-value">{player.life}</span>
              <span className="stat-label">Life</span>
              <span className="stat-value opponent-value">{opponent.life}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons mt-5">
          <Button className="button exit-btn">EXIT</Button>
          <Button className="button new-game-btn">NEW GAME</Button>
        </div>
      </Container>
    </div>
  );
}

export default GameSummaryPage;
