import React, { useEffect, useState } from 'react';
import { Container, Row, Spinner } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { getBoosters } from '../../../lib/server';
import BoostCard from '../../../components/airdrop/BoostCard';
import rainCrypt from '../../../assets/images/rain-crypt.png';
import './boosts.css';
import { useTranslation } from 'react-i18next';
function Boosts() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const [boosters, setBoosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoosters = async () => {
      try {
        setLoading(true);
        const data = await getBoosters();
        setBoosters(data);
      } catch (error) {
        console.error('Error fetching boosters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoosters();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '300px' }}
      >
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="boosts-page">
      <Container>
        <div className="boosts-header">
          <div className="balance-info">
            <h2 className="balance-title">{t('common.totalBalance')}</h2>
            <div className="balance-amount">
              {currentUser
                ? `${currentUser.balance?.toFixed(6)} PLTL`
                : '0 PLTL'}
            </div>
          </div>

          {currentUser && (
            <div className="mining-info">
              <div className="mining-stat">
                <span className="stat-label">{t('common.miningRate')}:</span>
                <span className="stat-value">{currentUser.miningRate}</span>
              </div>
              <div className="mining-stat">
                <span className="stat-label">
                  {t('common.miningFrequency')}
                </span>
                <span className="stat-value">
                  {currentUser.miningFrequency}h
                </span>
              </div>
            </div>
          )}
        </div>

        <Row className="boosts-grid">
          {boosters.map((booster) => (
            <BoostCard
              key={booster.id}
              id={booster.id}
              image={rainCrypt}
              title={booster.name}
              description={`${booster.miningRate} ${t('common.pltl')} per ${booster.miningFrequency} ${t('common.hours')}`}
              value={booster.price}
            />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Boosts;
