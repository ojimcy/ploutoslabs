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
    navigator.clipboard.writeText(link);
  };

  const claimBonus = async () => {
    const user = await claimReBonus(currentUser.telegramId);
    setUser(user);
  };

  const navigateToContest = () => {
    window.location.href = '/dashboard/ref-leaderboard';
  };

  return (
    <div className="referral-page">
      <Container className="referrals-container">
        <TelegramBackButton />
        <Container className="referrals-content">
          {/* Referral Contest Section */}
          <Row className="referral-contest-section mb-4">
            <Col>
              <div className="contest-info">
                🎉 **Referral Contest Ongoing!** 🎉 <br />
                Invite friends and earn rewards! Top referrers will win exciting
                prizes.
              </div>
              <Button
                onClick={navigateToContest}
                className="contest-button mt-3"
              >
                View Contest Details
              </Button>
            </Col>
          </Row>
          <Separator />

          {/* Referral Statistics Section */}
          <Row className="referrals-grid">
            <Col className="referrals-box">
              <div className="referrals-title">
                {currentUser ? currentUser.referralCount : 0} Referrals
              </div>
              <div className="referrals-text">
                You earn an 8% reward whenever your friends make a claim and 2%
                whenever their friends make a claim.
              </div>
            </Col>
          </Row>
          <Separator />

          {/* Referral Link Section */}
          <Row className="referrals-grid">
            <Col className="referral-link-container">
              <div className="referral-link-text">Referral Link</div>
              <div>
                {currentUser
                  ? `https://t.me/ploutos_labs_bot/app?startapp=${currentUser.telegramId}`
                  : ''}
              </div>
              <Button
                onClick={copyReferralLink}
                className="copy-link-button mt-4"
              >
                Copy Link
              </Button>
            </Col>
          </Row>
          <Separator />

          {/* Referral Bonus Section */}
          <Row className="referrals-grid">
            <Col className="referral-bonus-container">
              <div className="referral-bonus-text">Direct Referral Bonus</div>
              <div>
                {currentUser ? currentUser.referralBonus?.toFixed(6) : ''}
              </div>
              <Separator />
              <div className="referral-bonus-text mt-3">
                Indirect Referral Bonus
              </div>
              <div>
                {currentUser ? currentUser.referralBonus2?.toFixed(6) : ''}
              </div>
              <Separator />
              <Button onClick={claimBonus} className="claim-bonus-button mt-4">
                Claim Bonus
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default Referrals;
