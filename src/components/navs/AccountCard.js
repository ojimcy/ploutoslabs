import React, { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaClipboard,
  FaPlusSquare,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import '../airdrop/airdrop.css';

import { useWebApp, useTelegramUser } from '../../hooks/telegram';
import { Separator } from '../common/Seperator';

import './account.css';
import { Link } from 'react-router-dom';
import { getUserByTelegramID } from '../../lib/server';

function AccountCard() {
  const [currentUser, setCurrentUser] = useState({});
  const webApp = useWebApp();
  const telegramUser = useTelegramUser();

  useEffect(() => {
    if(!telegramUser) return
    const fn = async () => {
      const user = await getUserByTelegramID(telegramUser.id);
      console.log(user);
      setCurrentUser(user);
    };

    fn();
  }, [telegramUser]);

  const createSmartWallet = () => {
    webApp.openLink(`https://keys.ploutoslabs.io?uid=${telegramUser.id}`);
  };

  return (
    <div>
      <Container>
        {currentUser?.smartWalletAddress ? (
          <Link
            to="/dashboard/accounts"
            style={{ textDecoration: 'none', color: '#ffffff' }}
          >
            <Row className="mt-4 account-card">
              <Col xs="12" className="referral-card">
                <div className="referral-card-content mt-2">
                  <div className="referral-icon">
                    <div className="ref-icon">
                      <FaUser />
                    </div>
                    <div className="referral-info">
                      <div className="ref-title">{currentUser?.userName}</div>
                      <div className="ref-count">
                        {currentUser ? currentUser.balance : '0'} PLTL
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="right-arrow">
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Link>
        ) : (
          <Link
            onClick={createSmartWallet}
            style={{ textDecoration: 'none', color: '#ffffff' }}
          >
            <Row className="mt-4 account-card">
              <Col xs="12" className="referral-card">
                <div className="referral-card-content mt-2">
                  <div className="referral-icon">
                    <div className="ref-icon">
                      <FaUser />
                    </div>
                    <div className="referral-info">
                      <div className="ref-title">Create Smart Wallet</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="right-arrow">
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Link>
        )}

        <Row className="add-account-card">
          <Card>
            <CardBody>
              <div>
                <Link to="/dashboard/import-wallet" className="links">
                  <div className="referral-card-content my-4">
                    <div className="referral-icon">
                      <div className="ref-icon">
                        <FaPlusSquare />
                      </div>
                      <div className="referral-info">
                        <div className="ref-title">Import Account</div>
                      </div>
                    </div>
                    <div className="right">
                      <div className="right-arrow">
                        <FaArrowRight />
                      </div>
                    </div>
                  </div>
                </Link>
                <Separator />
              </div>
              <div>
                <Link to="/dashboard/wallet-credentials" className="links">
                  <div className="referral-card-content my-4">
                    <div className="referral-icon">
                      <div className="ref-icon">
                        <FaClipboard />
                      </div>
                      <div className="referral-info">
                        <div className="ref-title">Seed phrase</div>
                      </div>
                    </div>
                    <div className="right">
                      <div className="right-arrow">
                        <FaArrowRight />
                      </div>
                    </div>
                  </div>
                </Link>
                <Separator />
              </div>
            </CardBody>
          </Card>
        </Row>

        <Row className="mt-4 signout-card">
          <Col xs="12" className="referral-card">
            <div className="referral-card-content ">
              <div className="referral-icon">
                <div className="ref-icon">
                  <FaSignOutAlt />
                </div>
                <div className="referral-info">
                  <div className="ref-title">Logout</div>
                </div>
              </div>
              <div className="right">
                <div className="right-arrow">
                  <FaArrowRight />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AccountCard;
