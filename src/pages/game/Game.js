import React, { useState } from 'react';
import {
  Container,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { FaCaretDown, FaQuestion, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import TelegramBackButton from '../../components/common/TelegramBackButton';
import GameDificultyModal from '../../components/common/modal/GameDificultyModal';
import GameDepositModal from '../../components/common/modal/GameDepositModal';

import superman from '../../assets/images/superman.png';
import './game.css';
import WithdrawModal from '../../components/common/modal/WithdrawalModal';

function Game() {
  const [modal, setModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);

  const userBalance = 1000; // Example user balance

  const toggleModal = () => {
    setModal(!modal);
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

  return (
    <div className="game-page">
      <TelegramBackButton />
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
                <DropdownItem header>Balance: ${userBalance}</DropdownItem>
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
            <Link onClick={toggleModal} className="play-button mt-4">
              Create Game
            </Link>
            <Link to="/game/join" className="play-button mt-4">
              Join Game
            </Link>
          </div>
        </Row>
      </Container>

      {/* Game Difficulty Modal */}
      <GameDificultyModal isOpen={modal} toggle={toggleModal} />
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
