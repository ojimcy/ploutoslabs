import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { FaPlus, FaWallet, FaCheck, FaCog } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './wallets.css';
import { useCurrentUser } from '../../../hooks/telegram';
import { getUserByTelegramID, getWallets } from '../../../lib/server';
import { formatAddress } from '../../../lib/utils';
import { AppContext } from '../../../context/AppContext';
import { syncWallet } from '../../../lib/db';

const ViewWallets = () => {
  const [wallets, setWallets] = useState([]);
  const { setSelectedWallet, selectedWallet, setWalletToManage } =
    useContext(AppContext);
  const navigate = useNavigate();

  const telegramId = localStorage.getItem('TELEGRAM_ID');
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!telegramId) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramId);

      const wals = await getWallets(user.id);
      if (!wals || wals.length == 0) return;
      setSelectedWallet(selectedWallet || wals[0]);
      setWallets(wals);

      await syncWallet(currentUser.id);
    };

    fn();
  }, [telegramId]);

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
  };

  const handleSettingsClick = (wallet) => {
    setWalletToManage(wallet);
    navigate(`/dashboard/wallet`);
  };

  return (
    <Container className="wallet-page">
      <Row className="mb-4">
        <Col>
          <h1>Your Wallets</h1>
          <p>Manage all your cryptocurrency accounts in one place.</p>
        </Col>
      </Row>
      <Row>
        {wallets.map((wallet) => (
          <Col md="4" key={wallet.id} className="mb-3">
            <div
              className="wallet-card"
              onClick={() => handleWalletSelect(wallet)}
            >
              <div className="wallet-card-content">
                <div className="wallet-icon">
                  <FaWallet />
                </div>
                <div className="wallet-info">
                  <div className="wallet-title">{wallet.name}</div>
                  <div className="wallet-balance">
                    {formatAddress(wallet.address)}
                  </div>
                  {wallet.label && (
                    <div className="wallet-label">{wallet.label}</div>
                  )}
                </div>
                <div className="wallet-actions-wrapper">
                  {selectedWallet && selectedWallet.id === wallet.id && (
                    <div className="selected-check">
                      <FaCheck />
                    </div>
                  )}
                  <button
                    className="settings-button"
                    onClick={() => handleSettingsClick(wallet)}
                  >
                    <FaCog />
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
        <Col md="4" className="mb-3">
          <div className="add-wallet-card">
            <Link to="/dashboard/create" className="links">
              <div className="wallet-card-content">
                <div className="wallet-icon">
                  <FaPlus />
                </div>
                <div className="wallet-info">
                  <div className="wallet-title">Add New Wallet</div>
                </div>
              </div>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewWallets;
