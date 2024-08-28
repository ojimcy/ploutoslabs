import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import { FaCaretDown, FaQuestion, FaWallet, FaShare } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import TelegramBackButton from '../../components/common/TelegramBackButton';
import GameDificultyModal from '../../components/common/modal/GameDificultyModal';
import GameDepositModal from '../../components/common/modal/GameDepositModal';

import superman from '../../assets/images/superman.png';
import './game.css';
import WithdrawModal from '../../components/common/modal/WithdrawalModal';
import { useCurrentUser } from '../../hooks/telegram';
import { getActiveGames } from '../../lib/server';

function Game() {
  const currentUser = useCurrentUser();
  const [difficultyModal, setDifficultyModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    console.log('currentUser', currentUser);

    const fetchActiveGames = async () => {
      try {
        const games = await getActiveGames(currentUser.id);
        setActiveGames(games);
      } catch (error) {
        console.error('Error fetching active games', error);
      }
    };

    if (currentUser) {
      fetchActiveGames();
    }
  }, [currentUser]);

  const toggleDifficultyModal = () => {
    setDifficultyModal(!difficultyModal);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDepositModal = () => {
    setDepositModal(!depositModal);
  };

  const toggleWithdrawalModal = () => {
    setWithdrawalModal(!withdrawalModal);
  };

  const handleWithdrawal = async () => {};

  const handleShare = (gameCode) => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      gameCode
    )}&text=${encodeURIComponent('Join my game on Super Catch! 🎮')}`;
    window.open(telegramUrl, '_blank');
  };

  const handlePlay = (gameCode) => {
    window.location.href = `/super-catch?code=${gameCode}`;
  };

  return (
    <div className="game-page">
      <TelegramBackButton />
      {currentUser && (
        <Container className="game-page">
          <div className="game-header">
            <div className="main-title">
              <h1>Super Catch</h1>
            </div>

            <div className="wallet-dropdown">
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle className="wallet-dropdown-toggle">
                  <FaWallet className="wallet-icon" />
                  <FaCaretDown />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem header>
                    Balance: ${currentUser.gameWalletBalance}
                  </DropdownItem>
                  <DropdownItem onClick={toggleDepositModal}>
                    Deposit
                  </DropdownItem>
                  <DropdownItem onClick={toggleWithdrawalModal}>
                    Withdraw
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
              <Link to="/game/join" className="play-button mt-4">
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
                  <div className="game-actions">
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
        </Container>
      )}

      {/* Game Difficulty Modal */}
      <GameDificultyModal
        isOpen={difficultyModal}
        toggle={toggleDifficultyModal}
      />
      <GameDepositModal isOpen={depositModal} toggle={toggleDepositModal} />
      <WithdrawModal
        isOpen={withdrawalModal}
        toggle={toggleWithdrawalModal}
        onSubmit={handleWithdrawal}
      />
    </div>
  );
}

export default Game;
