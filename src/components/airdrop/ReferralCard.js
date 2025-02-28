import React, { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaGift, FaUsers } from 'react-icons/fa';
import { Col, Row } from 'reactstrap';
import './airdrop.css';

import { useCurrentUser } from '../../hooks/telegram';
import { Link } from 'react-router-dom';
import { getUserByTelegramID } from '../../lib/server';
import { WebappContext } from '../../context/telegram';
import { useTranslation } from 'react-i18next';

function ReferralCard() {
  const currentUser = useCurrentUser();
  const { t } = useTranslation();
  const { setUser, user } = useContext(WebappContext);
  const [checkedIn, setCheckedIn] = useState(false);
  const telegramId = localStorage.getItem('TELEGRAM_ID');

  const fetchUserData = async () => {
    try {
      const user = await getUserByTelegramID(telegramId);
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    if (telegramId) {
      fetchUserData();
    }
  }, [telegramId]);

  useEffect(() => {
    const lastCheckinDate = new Date(user?.lastCheckInAt);
    const today = new Date();
    const isSameDay = lastCheckinDate.toDateString() === today.toDateString();

    setCheckedIn(isSameDay);
  }, [user]);

  return (
    <div className="task-reward-container mt-4">
      <Row className="justify-content-center">
        <Col xs="6" className="task-reward-card mr-1">
          <Link className="task-link" to="/dashboard/referrals">
            <div className="task-reward-card-content">
              <div className="icon-title-wrapper">
                <FaUsers className="task-icon" />
                <div className="task-title">{t('referral.title')}</div>
              </div>
              <div className="notification-badge">
                {currentUser ? currentUser.referralCount : 0}
              </div>
            </div>
          </Link>
        </Col>
        <Col xs="6" className="task-reward-card">
          <Link className="task-link" to="/dashboard/rewards">
            <div className="task-reward-card-content">
              <div className="icon-title-wrapper">
                <FaGift className="rewards-icon" />
                <div className="reward-title">{t('common.rewards')}</div>
              </div>
              {checkedIn ? (
                <FaCheckCircle color='#006F04' size={15}/>
              ) : (
                <div className="notification-dot"></div>
              )}
            </div>
          </Link>
        </Col>
      </Row>
    </div>
  );
}

export default ReferralCard;
