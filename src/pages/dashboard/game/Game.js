import React, { useState } from 'react';
import { Container, Row } from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { FaQuestion, FaWallet } from 'react-icons/fa';
import { useCurrentUser } from '../../../hooks/telegram';

import superman from '../../../assets/images/superman.png';
import { Link } from 'react-router-dom';

import './game.css';
import GameDificultyModal from '../../../components/common/modal/GameDificultyModal';

function Game() {
  const currentUser = useCurrentUser();
  const [modal, setModal] = useState(false);

  const togleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="game-page">
      <TelegramBackButton />
      <Container className="game-page">
        <div className="game-header">
          <div className="main-title">
            <h1>Super Catch</h1>
          </div>
          <div className="balance-section">
            <FaWallet className="wallet-icon" />
            <div className="balance">
              <span className="balance-amount">
                $
                {currentUser && currentUser.walletBalance
                  ? currentUser.walletBalance
                  : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Game Card Section */}
        <Row className="mt-5 d-flex justify-content-center align-items-center">
          <div className="game-card">
            <div className="card-info">
              <div></div>
              <FaQuestion />
            </div>
            <div className="character-image">
              <img src={superman} alt={superman} />
            </div>
            <h2 className="character-name">Superman</h2>
          </div>
          <div className="play-action d-flex justify-content-between align-items-center">
            <Link onClick={togleModal} className="play-button mt-4">
              Create Game
            </Link>
            <Link to='/game/join' className="play-button mt-4">
              Join Game
            </Link>
          </div>
        </Row>
      </Container>

      <GameDificultyModal isOpen={modal} toggle={togleModal} />
    </div>
  );
}

export default Game;
