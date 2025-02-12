/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import './daily-reward.css';

import logo from '../../assets/images/airdrop-logo.png';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import { claimDailyReward, getUserByTelegramID } from '../../lib/server';
import { toast } from 'react-hot-toast';
import { Container, Spinner } from 'reactstrap';
import { useCurrentUser } from '../../hooks/telegram';
import { AppContext } from '../../context/AppContext';
import { WebappContext } from '../../context/telegram';
const dailyRewards = [
  { day: 1, amount: '0.05' },
  { day: 2, amount: '0.1' },
  { day: 3, amount: '2.5' },
  { day: 4, amount: '5' },
  { day: 5, amount: '15' },
  { day: 6, amount: '25' },
  { day: 7, amount: '50' },
  { day: 8, amount: '100' },
  { day: 9, amount: '150' },
  { day: 10, amount: '200' },
];

function DailyReward() {
  const { checkedIn, setCheckedIn } = useContext(AppContext);
  const { setUser } = useContext(WebappContext);
  const currentUser = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState(null);

  const telegramId = localStorage.getItem('TELEGRAM_ID');

  const currentDay = currentUser?.checkInStreak;

  const fetchUserData = async () => {
    try {
      const user = await getUserByTelegramID(telegramId);
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    if (telegramId) {
      fetchUserData();
    }
  }, [telegramId]);

  useEffect(() => {
    if (currentUser?.lastCheckInAt) {
      const lastCheckin = new Date(currentUser.lastCheckInAt);
      const now = new Date();
      const isSameDay = lastCheckin.toDateString() === now.toDateString();
      setCheckedIn(isSameDay);

      if (isSameDay) {
        // Calculate next claim time (next day at 00:00 UTC)
        const tomorrow = new Date();
        tomorrow.setUTCHours(24, 0, 0, 0);
        setNextClaimTime(tomorrow);
      }
    }
  }, [currentUser]);

  const handleCheckIn = async (day) => {
    if (day !== currentDay || checkedIn) return;

    setLoading(true);
    try {
      const res = await claimDailyReward(telegramId);
      console.log('res', res);

      setCheckedIn(true);
      toast.success('Daily reward claimed successfully!');
      await fetchUserData();
    } catch (error) {
      console.error('Check-in failed:', error.response?.data || error.message);
      toast.error('Failed to claim daily reward');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeUntilNextClaim = () => {
    if (!nextClaimTime) return '';
    const now = new Date();
    const diff = nextClaimTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="daily-reward">
      <Container className="d-flex flex-column align-items-center">
        <div className="daily-reward-header">
          <h3>Daily Rewards</h3>
          <p>
            Earn game coins by logging into the game daily without missing a day
          </p>
          <span className="tips">
            Tip: Your streak will reset if you skip a day
          </span>
        </div>
        <div className="daily-reward-list w-100">
          {dailyRewards.map((reward, index) => (
            <div
              key={index}
              className={`daily-reward-item ${
                index + 1 <= currentDay ? 'active' : ''
              }`}
            >
              <div className="day">
                Day {reward.day}
                {index + 1 <= currentDay && (
                  <FaCheckCircle className="check-icon" />
                )}
              </div>
              <img src={logo} alt="Ploutos" />
              <div className="amount">
                <span className="reward-amount">{reward.amount}</span>
              </div>
            </div>
          ))}
        </div>
        {checkedIn ? (
          <div className="next-claim-info">
            <FaClock className="clock-icon" />
            <span>Next claim available in {formatTimeUntilNextClaim()}</span>
          </div>
        ) : (
          <button
            className={`claim-button ${loading || checkedIn ? 'disabled' : ''}`}
            onClick={() => handleCheckIn(currentDay)}
            disabled={loading || checkedIn}
          >
            {loading ? <Spinner size="sm" /> : 'Claim Reward!'}
          </button>
        )}
      </Container>
    </div>
  );
}

export default DailyReward;
