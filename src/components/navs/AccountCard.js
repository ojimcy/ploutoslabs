import React, { useEffect, useState, useContext } from 'react';
import {
  FaArrowRight,
  FaPlusSquare,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { Col, Container, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { WebappContext } from '../../context/telegram';
import { Separator } from '../common/Seperator';
import './account.css';
import { Link } from 'react-router-dom';
import { getUserByTelegramID } from '../../lib/server';
import { useTranslation } from 'react-i18next';

function AccountCard() {
  const [currentUser, setCurrentUser] = useState({});
  const telegramId = localStorage.getItem('TELEGRAM_ID');
  const navigate = useNavigate();
  const { setUser } = useContext(WebappContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!telegramId) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramId);
      setCurrentUser(user);
    };

    fn();
  }, [telegramId]);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('ACCESS_TOKEN_KEY');
    localStorage.removeItem('TELEGRAM_ID');

    // Clear user context
    setUser(null);

    // Redirect to auth page
    navigate('/auth');
  };

  return (
    <div>
      <Container>
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
                    <div className="ref-title">{currentUser?.username}</div>
                    <div className="ref-count">
                      {currentUser ? currentUser.balance?.toFixed(4) : '0'}
                      {t('common.pltl')}
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

        <Row className="add-account-card">
          <div className="account-card-content">
            <div>
              <Link to="/dashboard/import-wallet" className="links">
                <div className="referral-card-content my-4">
                  <div className="referral-icon">
                    <div className="ref-icon">
                      <FaPlusSquare />
                    </div>
                    <div className="referral-info">
                      <div className="ref-title">
                        {t('common.importAccount')}
                      </div>
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
              <Link to="/dashboard/accounts" className="links">
                <div className="referral-card-content my-4">
                  <div className="referral-icon">
                    <div className="ref-icon">
                      <FaPlusSquare />
                    </div>
                    <div className="referral-info">
                      <div className="ref-title">
                        {t('common.createAccount')}
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="right-arrow">
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Row>

        <Row className="mt-4 signout-card">
          <Col xs="12" className="referral-card">
            <div
              className="referral-card-content"
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            >
              <div className="referral-icon">
                <div className="ref-icon">
                  <FaSignOutAlt />
                </div>
                <div className="referral-info">
                  <div className="ref-title">{t('common.logout')}</div>
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
