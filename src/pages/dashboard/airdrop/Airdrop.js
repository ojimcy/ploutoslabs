import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Container } from 'reactstrap';
import {
  computeTokensToCliam,
  useCurrentUser,
  useTelegramUser,
} from '../../../hooks/telegram';

import airdropLogo from '../../../assets/images/airdrop-logo.png';

import './airdrop-main.css';
import { FaFire, FaGem, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { claimToken, getUserByTelegramID } from '../../../lib/server';
import { WebappContext } from '../../../context/telegram';

import rocket from '../../../assets/images/rocket.png';
import TelegramModal from '../../../components/modal/TelegramModal';

import gamePad from '../../../assets/images/pad.png';

function Airdrop() {
  const currentUser = useCurrentUser();
  const telegramUser = useTelegramUser();
  const { setUser } = useContext(WebappContext);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  // Fill time in minutes and fill rate in RAIN per hour

  const [currentAmount, setCurrentAmount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const updateAmount = () => {
      const amt = computeTokensToCliam(currentUser);
      setCurrentAmount(amt);
    };

    updateAmount(); // Initial update
    const interval = setInterval(updateAmount, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const claim = async () => {
    await claimToken(currentUser.telegramId);
    const user = await getUserByTelegramID(currentUser.telegramId);
    setUser(user);
  };

  const fetchUserData = useCallback(async () => {
    try {
      const user = await getUserByTelegramID(telegramUser.id);
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [telegramUser]);

  return (
    <div className="airdrop-page">
      <Container>
        <div className="airdrop-main">
          <Link className="game-pad" to="/game">
            <div className="bubble-effect"></div>
            <img width={50} src={gamePad} alt="game" />
          </Link>

          <div className="storage-section">
            <div className="d-flex flex-column align-items-center mb-5">
              <div className="avatar bg-black rounded-circle mb-3 d-flex justify-content-center align-items-center">
                <img width={50} height={50} src={airdropLogo} alt="Logo" />
              </div>
              <h1 className="fs-3 text-light mb-3">{currentUser?.username}</h1>

              {/* Balance */}
              <div className="text-center my-3">
                <div className="d-flex align-items-center justify-content-center gap-2 text-secondary">
                  <FaWallet className="icon-sm" />
                  <span>Balance</span>
                </div>
                <div className="fs-1 fw-bold text-light">
                  {currentUser ? currentUser.balance?.toFixed(2) : '0'} GPLTL
                </div>
              </div>
            </div>

            {/* Mining Stats */}
            <div className="mining-card border border-secondary rounded p-3  d-flex justify-content-between align-items-center">
              <FaGem className="icon-md text-secondary" />
              <div className="d-flex align-items-center gap-2">
                <span className="fs-5 text-warning fw-semibold">
                  {' '}
                  <span>{currentAmount?.toFixed(6)} GPLTL</span>
                </span>
              </div>
            </div>

            <div className="boost-area">
              <div className="energy d-flex flex-row align-items-center">
                <FaFire className="lightning-icon" size={25} />
                <span>
                  {currentUser && (
                    <small className="minig-rate">
                      {currentUser.miningRate} PLTL /{' '}
                      {currentUser.miningFrequency} hour
                    </small>
                  )}
                </span>
              </div>

              <div className="booster d-flex flex-row align-items-center">
                <Link className="" to="/dashboard/boosts">
                  <img width={25} height={25} src={rocket} alt="rocket" />
                  <span style={{ color: '#ffffff' }}>Boost</span>
                </Link>
              </div>
            </div>

            {/* Claim Button */}
            <div className="claim-section d-flex justify-content-center align-items-center mt-5">
              {!currentUser?.IsUserInChannel ? (
                <Button onClick={toggleModal} className="btn-claim">
                  claim
                </Button>
              ) : (
                <Button onClick={claim} className="btn-claim">
                  Claim
                </Button>
              )}
            </div>
          </div>
        </div>

        <TelegramModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          fetchUserData={fetchUserData}
        />
      </Container>
    </div>
  );
}

export default Airdrop;
