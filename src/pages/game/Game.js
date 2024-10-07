import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Col,
} from 'reactstrap';
import {
  FaCaretDown,
  FaQuestion,
  FaWallet,
  FaShare,
  FaEthereum,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import TelegramBackButton from '../../components/common/TelegramBackButton';
import GameDificultyModal from '../../components/common/modal/GameDificultyModal';
import GameDepositModal from '../../components/common/modal/GameDepositModal';

import superman from '../../assets/images/superman.png';
import './game.css';
import WithdrawModal from '../../components/common/modal/WithdrawalModal';
import { useCurrentUser } from '../../hooks/telegram';
import { getActiveGames, submitGameWithdrawal } from '../../lib/server';
import { openSuperCatchGameConsole } from '../../lib/utils';
import { toast } from 'react-toastify';

import pltlLogo from '../../assets/images/logo.png';

function Game() {
  const currentUser = useCurrentUser();
  const [difficultyModal, setDifficultyModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDepositModal = () => {
    setDepositModal(!depositModal);
  };

  const toggleWithdrawalModal = () => {
    setWithdrawalModal(!withdrawalModal);
  };

  const handleWithdrawal = async (amount, address) => {
    try {
      await submitGameWithdrawal({amount: parseFloat(amount), destinationAddress: address })
      toast.success('Request submitted')
    } catch(err) {
      console.log(err)
      toast.error('Error in placing request')
    }
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
          <div className="game-header">
            <Link to="/" className="main-title">
              <img src={pltlLogo} alt="logo" />
            </Link>

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
                  <DropdownItem>
                    <Link to="/dashboard/game-leaderboard">Leaderboard</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to="/">Home</Link>
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
