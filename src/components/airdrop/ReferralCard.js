import React from 'react';
import { FaArrowRight, FaUsers } from 'react-icons/fa';
import { Col, Container, Row } from 'reactstrap';
import './airdrop.css';

import logo from '../../assets/images/logo.png';
import { useCurrentUser } from '../../hooks/telegram';

function ReferralCard() {
  const currentUser = useCurrentUser();
  return (
    <div>
      <Container>
        <Row className="mt-4">
          <Col xs="12" className="referral-card">
            <div className="referral-card-content mt-2">
              <div className="referral-icon">
                <div className="ref-icon">
                  <img src={logo} alt="" width={45} height={45} />
                </div>
                <div className="referral-info">
                  <div className="ref-title">Referrals</div>
                  <div className="ref-count">
                    <FaUsers style={{ marginRight: '5px' }} />{' '}
                    {currentUser ? currentUser.referralCount : '0'}
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
      </Container>
    </div>
  );
}

export default ReferralCard;
