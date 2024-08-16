import React, { useState, useEffect } from 'react';
import { Container, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { FaCaretDown, FaQuestion, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import superman from '../../../assets/images/superman.png';
import GameDificultyModal from '../../../components/common/modal/GameDificultyModal';
import './game.css';

function Game() {
  const [modal, setModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [depositAddress, setDepositAddress] = useState('');

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

  useEffect(() => {
    if (depositModal) {
      // Fetch the deposit address when the modal is opened
      fetchDepositAddress();
    }
  }, [depositModal]);

  const fetchDepositAddress = async () => {
    // Replace with actual API call to fetch deposit address
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    setDepositAddress(address);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress);
    alert('Deposit address copied to clipboard!');
  };

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
                <DropdownItem onClick={toggleDepositModal}>Deposit</DropdownItem>
                <DropdownItem tag={Link} to="/withdraw">Withdraw</DropdownItem>
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
            <Link to='/game/join' className="play-button mt-4">
              Join Game
            </Link>
          </div>
        </Row>
      </Container>

      {/* Game Difficulty Modal */}
      <GameDificultyModal isOpen={modal} toggle={toggleModal} />

      {/* Deposit Modal */}
      <Modal isOpen={depositModal} toggle={toggleDepositModal}>
        <ModalHeader toggle={toggleDepositModal}>Deposit Address</ModalHeader>
        <ModalBody>
          <p>Your deposit address is:</p>
          <div className="deposit-address">
            <code>{depositAddress}</code>
          </div>
          <Button color="primary" onClick={copyToClipboard}>Copy Address</Button>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDepositModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Game;
