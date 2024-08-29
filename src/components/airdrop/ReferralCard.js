import React from 'react';
import { FaGift, FaUsers } from 'react-icons/fa';
import { Col, Row } from 'reactstrap';
import './airdrop.css';

import { useCurrentUser } from '../../hooks/telegram';
import { Link } from 'react-router-dom';

function ReferralCard() {
  const currentUser = useCurrentUser();
  return (
    <div className="task-reward-container mt-4">
      <Row className="justify-content-center">
        <Col xs="6" className="task-reward-card mr-1">
          <Link className='task-link' to="/dashboard/referrals">
            <div className="task-reward-card-content">
              <div className="icon-title-wrapper">
                <FaUsers className="task-icon" />
                <div className="task-title">Referrals</div>
              </div>
              <div className="notification-badge">
                {currentUser ? currentUser.referralCount : 0}
              </div>
            </div>
          </Link>
        </Col>
        <Col xs="6" className="task-reward-card">
          <Link className='task-link' to="/dashboard/rewards">
            <div className="task-reward-card-content">
              <div className="icon-title-wrapper">
                <FaGift className="rewards-icon" />
                <div className="reward-title">Rewards</div>
              </div>
              <div className="notification-dot"></div>
            </div>
          </Link>
        </Col>
      </Row>
    </div>
  );
}

export default ReferralCard;
