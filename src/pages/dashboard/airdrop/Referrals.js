import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { WebappContext } from '../../../context/telegram';
import { claimReBonus, getReferrals } from '../../../lib/server';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import './referrals.css';
import { toast } from 'react-toastify';
import { FaUsers, FaGift, FaCopy } from 'react-icons/fa';
import ReferralTable from '../../../components/airdrop/ReferralTable';
function Referrals() {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);

  const [loading, setLoading] = useState(false);
  const [firstGeneration, setFirstGeneration] = useState([]);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        setLoading(true);
        const result = await getReferrals();
        setFirstGeneration(result.firstGeneration || []);
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
    toast.success('Referral link copied to clipboard');
  };

  const claimBonus = async () => {
    try {
      setLoading(true);
      const user = await claimReBonus(currentUser.telegramId);
      setUser(user);
      toast.success('Bonus claimed successfully!');
    } catch (error) {
      toast.error('Failed to claim bonus');
    } finally {
      setLoading(false);
    }
  };

  const navigateToContest = () => {
    window.location.href = '/dashboard/ref-leaderboard';
  };

  const totalReferrals = firstGeneration.length;

  return (
    <div className="referral-page">
      <Container className="referrals-container">
        <TelegramBackButton />
        <Container className="referrals-content">
          {/* Stats Cards Row */}
          <Row className="stats-row">
            <Col md="6" className="mb-4">
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
            <Col md="6" className="mb-4">
              <div className="stats-card">
                <div className="stats-icon">
                  <FaGift />
                </div>
                <div className="stats-info">
                  <h3>{currentUser?.referralBonus?.toFixed(2) || '0.00'}</h3>
                  <p>Referral Bonus (PLTL)</p>
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
              loading={loading}
            />
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default Referrals;
