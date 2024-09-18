import React, { useContext, useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { FaPlus, FaWallet, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './wallets.css';
import { useTelegramUser } from '../../../hooks/telegram';
import { getUserByTelegramID, getWallets } from '../../../lib/server';
import { formatAddress } from '../../../lib/utils';
import { AppContext } from '../../../context/AppContext';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

const ViewWallets = () => {
  const [wallets, setWallets] = useState([]);
  // const [selectedWalletId, setSelectedWalletId] = useState(null);
  const { setSelectedWallet, selectedWallet } = useContext(AppContext);

  // const [currentUser, setCurrentUser] = useState({});
  const telegramUser = useTelegramUser();

  useEffect(() => {
    if (!telegramUser) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramUser.id);

      const wals = await getWallets(user.id);
      console.log('wals', wals);
      if (!wals || wals.length == 0) return;
      setSelectedWallet(selectedWallet || wals[0]);
      setWallets(wals);
    };

    fn();
  }, [telegramUser]);

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
  };

  return (
    <Container className="mt-4">
      <TelegramBackButton />
      <Row className="mb-3">
        <Col>
          <h1>Your Wallets</h1>
          <p>Manage all your cryptocurrency accounts in one place.</p>
        </Col>
      </Row>
      <Row>
        {wallets.map((wallet) => (
          <Col md="4" key={wallet.id} className="mb-3">
            <Card onClick={() => handleWalletSelect(wallet)}>
              <CardBody>
                <div className="wallet-card-content">
                  <div className="wallet-icon">
                    <FaWallet />
                  </div>
                  <div className="wallet-info d-flex justify-content-between align-items-center">
                    <div className="info-main">
                      <div className="wallet-title">{wallet.name}</div>
                      <div className="wallet-balance">
                        {formatAddress(wallet.address)}
                      </div>
                      <div className="wallet-balance">{wallet.label}</div>
                    </div>

                    {selectedWallet && selectedWallet.id === wallet.id && (
                      <div className="selected-check">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
        <Col md="4" className="mb-3">
          <Card className="add-wallet-card">
            <CardBody>
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewWallets;
