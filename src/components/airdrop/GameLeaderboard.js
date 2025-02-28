import React, { useEffect, useState } from 'react';
import './game-leaderboard.css';
import { useCurrentUser } from '../../hooks/telegram';
import { getGameLeaderboard } from '../../lib/server';
import { Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';
const GameLeaderboard = () => {
  const currentUser = useCurrentUser();
  const { t } = useTranslation();
  const [topEarners, setTopEarners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [userEarnings, setUserEarnings] = useState(0);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await getGameLeaderboard();

        setLeaderboard(res);
        setTopEarners(res.leaders);
        setUserPosition(res.myPosition);
        setUserEarnings(res.myEarning);
      } catch (error) {
        console.error('Error in fetching game ref leaderboard.', error);
      } finally {
        setLoading(false);
      }
    };

    getLeaderboard();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isInTop5 = topEarners.some(
    (earner) => earner.username === currentUser?.username
  );
  
  return (
    <div className="referral-leaderboard">
      <Container>
        {/* User Summary */}
        <div className="user-summary">
          <h5>{t('game.leaderboard.title')}</h5>
          <div className="stats">
            <p>
              <strong>{t('game.leaderboard.myReferralEarnings')}</strong>${userEarnings.toFixed(3)}
            </p>
            <p>
              <strong>{t('game.leaderboard.totalReferralPotBalance')}</strong>$
              {leaderboard?.pot?.toFixed(3)}
            </p>
          </div>
        </div>

        {/* Top 5 Referral Earners */}
        <div className="top-earners">
          <h3>{t('game.leaderboard.top5')}</h3>
          <ul>
            {topEarners?.map((earner, index) => (
              <li
                key={earner.username}
                className={`earner ${
                  earner.username === currentUser?.username ? 'highlight' : ''
                }`}
              >
                <span>
                  #{index + 1} {earner.username}
                </span>
                <span>${earner.earning.toFixed(3)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* User's Position */}
        {!isInTop5 && (
          <div className="user-position">
            <h4>{t('game.leaderboard.yourPosition')}</h4>
            <p>
              {t('game.leaderboard.currentPosition')} <strong>#{userPosition}</strong>
              <br />
              {t('game.leaderboard.earnings')} <strong>${userEarnings.toFixed(3)}</strong>
            </p>
            somehting
          </div>
        )}

        {/* Info Note */}
        <div className="referral-pot-note">
          <p>
            <strong>{t('game.leaderboard.note')}</strong>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default GameLeaderboard;
