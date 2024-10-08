import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Button,
  Col,
} from 'reactstrap';
import {
  FaQuestion,
  FaShare,
  FaEthereum,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import TelegramBackButton from '../../components/common/TelegramBackButton';
import GameDificultyModal from '../../components/common/modal/GameDificultyModal';

import superman from '../../assets/images/superman.png';
import './game.css';
import { useCurrentUser } from '../../hooks/telegram';
import { getActiveGames } from '../../lib/server';
import { openSuperCatchGameConsole } from '../../lib/utils';


function SuperCatchGame() {
  const currentUser = useCurrentUser();
  const [difficultyModal, setDifficultyModal] = useState(false);
  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    const fetchActiveGames = async () => {
      try {
        const games = await getActiveGames();
        setActiveGames(games);
      } catch (error) {
        console.error('Error fetching active games', error);
      }
    };

    fetchActiveGames();
  }, []);

  const toggleDifficultyModal = () => {
    setDifficultyModal(!difficultyModal);
  };

  const handleShare = (gameCode) => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      gameCode
    )}&text=${encodeURIComponent('Join my game on Super Catch! 🎮')}`;
    window.open(telegramUrl, '_blank');
  };

  const handlePlay = (gameCode) => {
    openSuperCatchGameConsole(gameCode, currentUser.id);
  };

  return (
    <div className="game-page">
      <TelegramBackButton />
      {currentUser && (
        <Container className="game-page">
          {/* Game Card Section */}
          <Row className="mt-5 d-flex justify-content-center align-items-center">
            <div className="game-card">
              <div className="card-info">
                <div></div>
                <FaQuestion />
              </div>
              <div className="character-image">
                <img src={superman} alt="Superman character" />
              </div>
              <h2 className="character-name">Superman</h2>
            </div>
            <div className="play-action d-flex justify-content-between align-items-center">
              <Link
                onClick={toggleDifficultyModal}
                className="play-button mt-4"
              >
                Create Game
              </Link>
              <Link to="/game/super-catch/join" className="play-button mt-4">
                Join Game
              </Link>
            </div>
          </Row>

          {/* Active Games Section */}
          <div className="active-games-section mt-5">
            <h2>Active Games</h2>
            {activeGames.length === 0 ? (
              <p>No active games</p>
            ) : (
              activeGames.map((game) => (
                <div key={game.code} className="active-game-card">
                  <div className="game-info">
                    <p>
                      <strong>Game Code:</strong> {game.code}
                    </p>
                    <p>
                      <strong>Opponent:</strong>{' '}
                      {game.opponentNickname || 'Waiting for opponent...'}
                    </p>
                  </div>
                  <div className="game-actions d-flex justify-content-between align-items-center mb-3">
                    <Button
                      className="play-btn"
                      onClick={() => handlePlay(game.code)}
                    >
                      Play
                    </Button>
                    <Button
                      className="share-btn"
                      onClick={() => handleShare(game.code)}
                    >
                      <FaShare /> Share
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Row>
            <Col>
              <span className="mt-4">
                Total Earnings:{' '}
                <span style={{ fontWeight: 'bold' }}>
                  <FaEthereum />
                  {currentUser?.gameWalletBalance}
                </span>
              </span>
              {/* {referrals.map((r) => (
                <React.Fragment key={r.id}>
                  <div className="referral-card d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle">
                        <span>{`${r.first_name[0]}${r.last_name[0]}`}</span>
                      </div>
                      <span className="referral-username ml-2">
                        {r.username}
                      </span>
                    </div>
                    <span className="referral-balance">+{r.reward}</span>
                  </div>
                </React.Fragment>
              ))} */}
            </Col>
          </Row>
        </Container>
      )}

      {/* Game Difficulty Modal */}
      <GameDificultyModal
        isOpen={difficultyModal}
        toggle={toggleDifficultyModal}
      />
    </div>
  );
}

export default SuperCatchGame;
