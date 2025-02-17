import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { claimReBonus } from '../../../lib/server';
import './referrals.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../../../constants';
import { WebappContext } from '../../../context/telegram';

function Referrals() {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const copyReferralLink = () => {
    const link = `${BASE_URL}?ref=${currentUser.telegramId}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard');
  };

  const claimBonus = async () => {
    try {
      setLoading(true);
      const user = await claimReBonus(currentUser.telegramId);
      setUser(user);
    } catch (error) {
      toast.error('Failed to claim bonus');
    } finally {
      setLoading(false);
    }
  };

  const navigateToContest = () => {
    navigate('/dashboard/ref-leaderboard');
  };

  return (
    <div className="referral-page">
      <Container className="referrals-container">
        <div className="referrals-content">
          {/* Contest Section */}
          <Row className="referral-contest-section">
            <Col>
              <div className="contest-info flex-column">
                <span role="img" aria-label="celebration">
                  🎉
                </span>{' '}
                <strong>Referral Contest Ongoing!</strong>{' '}
                <span role="img" aria-label="celebration">
                  🎉
                </span>
                <br />
                Invite friends and earn rewards! Top referrers will win exciting
                prizes.
              </div>
              <Button onClick={navigateToContest} className="contest-button">
                View Contest Details
              </Button>
            </Col>
          </Row>

          <div className="separator" />

          {/* Statistics Section */}
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

          <div className="separator" />

          {/* Referral Link Section */}
          <Row className="referrals-grid">
            <Col className="referral-link-container">
              <div className="referral-link-text">Your Referral Link</div>
              <div>
                {currentUser ? `${BASE_URL}?ref=${currentUser.telegramId}` : ''}
              </div>
              <Button
                onClick={copyReferralLink}
                className="copy-link-button mt-4"
              >
                Copy Link
              </Button>
            </Col>
          </Row>

          <div className="separator" />

          {/* Bonus Section */}
          <Row className="referrals-grid">
            <Col className="referral-bonus-container">
              <div className="referral-bonus-text">Direct Referral Bonus</div>
              <div>
                {currentUser
                  ? `${currentUser.referralBonus?.toFixed(6)} PLTL`
                  : '0 PLTL'}
              </div>

              <div className="referral-bonus-text mt-3">
                Indirect Referral Bonus
              </div>
              <div>
                {currentUser
                  ? `${currentUser.referralBonus2?.toFixed(6)} PLTL`
                  : '0 PLTL'}
              </div>

              <Button
                onClick={claimBonus}
                className="claim-bonus-button mt-4"
                disabled={loading}
              >
                {loading ? <Spinner size="sm"  /> : 'Claim Bonus'}
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Referrals;
