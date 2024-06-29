import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { WebappContext } from '../../../context/telegram';
import { claimReBonus } from '../../../lib/server';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import './referrals.css';
import { Separator } from '../../../components/common/Seperator';

function Referrals() {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);

  const copyReferralLink = () => {
    const link = `https://t.me/ploutos_labs_bot/app?startapp=${currentUser.telegramId}`;
    console.log(link);
    navigator.clipboard.writeText(link);
  };

  const claimBonus = async () => {
    const user = await claimReBonus(currentUser.telegramId);
    setUser(user);
  };

  return (
    <Container className="referrals-container">
      <TelegramBackButton />
      <Container className="referrals-content">
        <Row className="referrals-grid">
          <Col className="referrals-box">
            <div className="referrals-title">
              {currentUser ? currentUser.referralCount : 0} Referrals
            </div>
            <div className="referrals-text">
              You earn a 8% reward whenever your friends make a claim and 2%
              whenever their friends make a claim.
            </div>
          </Col>
        </Row>
        <Separator />
        <Row className="referrals-grid">
          <Col className="referral-link-container">
            <div className="referral-link-text">Referral Link</div>
            <div>
              {currentUser
                ? `https://t.me/ploutos_labs_bot/app?startapp=${currentUser.telegramId}`
                : ''}
            </div>
            <Button onClick={copyReferralLink} className="copy-link-button mt-4">
              Copy Link
            </Button>
          </Col>
        </Row>
        <Separator />
        <Row className="referrals-grid">
          <Col className="referral-bonus-container">
            <div className="referral-bonus-text">Referral Bonus</div>
            <div>{currentUser ? currentUser.referralBonus.toFixed(6) : ''}</div>
            <Separator />
            <div className="referral-bonus-text mt-3">Indirect Referral Bonus</div>
            <div>
              {currentUser ? currentUser.referralBonus2.toFixed(6) : ''}
            </div>
            <Separator />
            <Button onClick={claimBonus} className="claim-bonus-button mt-4">
              Claim Bonus
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Referrals;
