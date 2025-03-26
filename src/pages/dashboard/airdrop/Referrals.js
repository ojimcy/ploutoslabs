import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'reactstrap';
import { useCurrentUser, useReferralLink } from '../../../hooks/telegram';
import { claimReBonus, fetchReferrals } from '../../../lib/server';
import './referrals.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { WebappContext } from '../../../context/telegram';
import ReferralTable from '../../../components/airdrop/ReferralTable';
import { FiCopy, FiGift, FiUsers } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

function Referrals() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const referralLink = useReferralLink(currentUser);
  const { setUser } = useContext(WebappContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [firstGeneration, setFirstGeneration] = useState([]);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        setLoading(true);
        const result = await fetchReferrals();
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
    const link = referralLink;
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
    navigate('/dashboard/ref-leaderboard');
  };

  const totalReferrals = firstGeneration.length;

  return (
    <div className="referral-page">
      <Container className="referrals-container">
        <div className="referrals-content">
          {/* Stats Cards Row */}
          <Row className="stats-row">
            <Col md="6" className="mb-4">
              <div className="stats-card">
                <div className="stats-icon">
                  <FiUsers />
                </div>
                <div className="stats-info">
                  <h3>{totalReferrals}</h3>
                  <p>{t('referral.totalReferrals')}</p>
                </div>
              </div>
            </Col>
            <Col md="6" className="mb-4">
              <div className="stats-card">
                <div className="stats-icon">
                  <FiGift />
                </div>
                <div className="stats-info">
                  <h3>{currentUser?.referralBonus?.toFixed(2) || '0.00'}</h3>
                  <p>
                    {t('referral.directBonus')} ({t('common.pltl')})
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Referral Link Card */}
          <div className="referral-link-section">
            <div className="referral-link-header">
              <h2>{t('referral.yourReferralLink')}</h2>
              <Button
                className="claim-button"
                onClick={claimBonus}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : t('referral.claimBonus')}
              </Button>
            </div>
            <div className="referral-link-box">
              <input type="text" value={referralLink} readOnly />
              <Button className="copy-button" onClick={copyReferralLink}>
                <FiCopy /> {t('common.copy')}
              </Button>
            </div>
          </div>

          {/* Contest Banner */}
          <div className="contest-banner" onClick={navigateToContest}>
            <div className="contest-text">
              <h3>{t('referral.referralContest')}</h3>
              <p>{t('referral.referralContestSubtitle')}</p>
            </div>
            <Button className="view-contest-button">
              {t('common.viewDetails')}
            </Button>
          </div>

          {/* Referral Table */}
          <div className="referral-table-section">
            <ReferralTable
              firstGeneration={firstGeneration}
              loading={loading}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Referrals;
