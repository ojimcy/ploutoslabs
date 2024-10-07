import React, { useEffect, useState } from 'react';
import './game-leaderboard.css';
import { useCurrentUser } from '../../hooks/telegram';
import { getGameLeaderboard } from '../../lib/server';
import { Container } from 'reactstrap';
import TelegramBackButton from '../common/TelegramBackButton';

const GameLeaderboard = () => {
  const currentUser = useCurrentUser();

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
        console.log('leaderboard', res);

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
        <TelegramBackButton />

        {/* User Summary */}
        <div className="user-summary">
          <h5>Game Referral Leaderboard</h5>
          <div className="stats mt-2">
            <p>
              <strong>My Referral Earnings:</strong> $
              {userEarnings.toFixed(3)}
            </p>
            <p>
              <strong>Total Referral Pot Balance:</strong> $
              {leaderboard?.pot?.toFixed(3)}
            </p>
          </div>
        </div>

        {/* Top 5 Referral Earners */}
        <div className="top-earners">
          <h3>Top 5 Referral Earners</h3>
          <ul>
            {topEarners?.map((earner, index) => (
              <li
                key={earner.username}
                className={`earner ${
                  earner.username === currentUser?.username ? 'highlight' : ''
                }`}
              >
                <span>
                  {index + 1}. {earner.username}
                </span>
                <span>${earner.earning.toFixed(3)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="referral-pot-note">
          <p>
            <strong>Note:</strong> Only the top 5 referral earners will share in
            the referral pot. Keep referring more users to secure your spot in
            the top 5 and increase your earnings!
          </p>
        </div>

        {/* User's Position */}
        {!isInTop5 && userPosition && (
          <div className="user-position">
            <h4>Your Position</h4>
            <p>
              Current position <strong>#{userPosition}</strong>, earnings $
              {userEarnings.toFixed(3)}.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default GameLeaderboard;
