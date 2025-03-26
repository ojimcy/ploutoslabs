import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { WebappContext } from '../../../context/telegram';
import { claimReBonus, getReferrals } from '../../../lib/server';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import './referrals.css';
import { toast } from 'react-toastify';
import { FaUsers, FaGift,  FaCopy } from 'react-icons/fa';
import ReferralTable from '../../../components/airdrop/ReferralTable';
function Referrals() {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);

  const [loading, setLoading] = useState(false);
  const [firstGeneration, setFirstGeneration] = useState([]);
  const [secondGeneration, setSecondGeneration] = useState([]);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        setLoading(true);
        const result = await getReferrals();
        setFirstGeneration(result.firstGeneration || []);
        setSecondGeneration(result.secondGeneration || []);
      } catch (error) {
        console.log('Error in getReferrals', error);
        toast.error('Failed to get referrals');
      } finally {
        setLoading(false);
      }
    };
    loadReferrals();
  }, []);

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

  const totalReferrals = firstGeneration.length + secondGeneration.length;

  return (
    <div className="referral-page">
      <Container className="referrals-container">
        <TelegramBackButton />
        <Container className="referrals-content">
          {/* Stats Cards Row */}
          <Row className="stats-row">
            <Col md="4" className="mb-4">
              <div className="stats-card">
                <div className="stats-icon">
                  <FaUsers />
                </div>
                <div className="stats-info">
                  <h3>{totalReferrals}</h3>
                  <p>Total Referrals</p>
                </div>
              </div>
            </Col>
            <Col md="4" className="mb-4">
              <div className="stats-card">
                <div className="stats-icon">
                  <FaGift />
                </div>
                <div className="stats-info">
                  <h3>{currentUser?.referralBonus?.toFixed(2) || '0.00'}</h3>
                  <p>Direct Bonus (PLTL)</p>
                </div>
              </div>
            </Col>
            <Col md="4" className="mb-4">
              <div className="stats-card">
                <div className="stats-icon">
                  <FaGift />
                </div>
                <div className="stats-info">
                  <h3>{currentUser?.referralBonus2?.toFixed(2) || '0.00'}</h3>
                  <p>Indirect Bonus (PLTL)</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Referral Link Card */}
          <div className="referral-link-section">
            <div className="referral-link-header">
              <h2>Your Referral Link</h2>
              <Button
                className="claim-button"
                onClick={claimBonus}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : 'Claim Bonus'}
              </Button>
            </div>
            <div className="referral-link-box">
              <input
                type="text"
                value={
                  currentUser
                    ? `https://t.me/ploutos_labs_bot/app?startapp=${currentUser.telegramId}`
                    : ''
                }
                readOnly
              />
              <Button className="copy-button" onClick={copyReferralLink}>
                <FaCopy /> Copy Link
              </Button>
            </div>
          </div>

          {/* Contest Banner */}
          <div className="contest-banner" onClick={navigateToContest}>
            <div className="contest-text">
              <h3>🏆 Referral Contest</h3>
              <p>Join the contest and win exciting prizes!</p>
            </div>
            <Button className="view-contest-button">View Details</Button>
          </div>

          {/* Referral Table */}
          <div className="referral-table-section">
            <ReferralTable
              firstGeneration={firstGeneration}
              secondGeneration={secondGeneration}
              loading={loading}
            />
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default Referrals;
