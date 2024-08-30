/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import './daily-reward.css';

import logo from '../../assets/images/airdrop-logo.png';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTelegramUser } from '../../hooks/telegram';
import { claimDailyReward, getUserByTelegramID } from '../../lib/server';
import { WebappContext } from '../../context/telegram';
import { toast } from 'react-toastify';
import { Container, Spinner } from 'reactstrap';
import TelegramBackButton from '../common/TelegramBackButton';

const dailyRewards = [
  { day: 1, amount: '0.0005' },
  { day: 2, amount: '0.001' },
  { day: 3, amount: '0.025' },
  { day: 4, amount: '0.005' },
  { day: 5, amount: '0.15' },
  { day: 6, amount: '0.25' },
  { day: 7, amount: '0.5' },
  { day: 8, amount: '1' },
  { day: 9, amount: '2.5' },
  { day: 10, amount: '5' },
];

function DailyReward() {
  const { setUser, user } = useContext(WebappContext);
  const telegramUser = useTelegramUser();
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate current day in the streak based on currentUser's streak
  const currentDay = user?.checkInStreak;

  const fetchUserData = async () => {
    try {
      const user = await getUserByTelegramID(telegramUser.id);
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    if (telegramUser) {
      fetchUserData();
    }
  }, [telegramUser]);

  useEffect(() => {
    const lastCheckinDate = new Date(user?.lastCheckInAt);
    const today = new Date();
    const isSameDay = lastCheckinDate.toDateString() === today.toDateString();

    setCheckedIn(isSameDay);
  }, [user]);

  const handleCheckIn = async (day) => {
    if (day !== currentDay || checkedIn) return;

    setLoading(true);
    try {
      await claimDailyReward();
      setCheckedIn(true);
      toast.success('Checked in successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      await fetchUserData();
    } catch (error) {
      console.error('Check-in failed:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="daily-reward">
      <Container className="d-flex flex-column align-items-center">
        <TelegramBackButton />
        <div className="daily-reward-header mt-4">
          <h3>Rewards</h3>
          <p className="mt-4">
            Earn game coins by logging into the game daily without missing a day
          </p>
          <span className="text-muted">
            Tip: Your streak will reset if you skip a day
          </span>
        </div>
        <div className="daily-reward-list mt-5">
          {dailyRewards.map((reward, index) => (
            <div
              key={index}
              className={`daily-reward-item ${
                index + 1 <= currentDay ? 'active' : ''
              }`}
            >
              <div className="day">
                Day {reward.day}{' '}
                {index + 1 <= currentDay ? (
                  <FaCheckCircle color="green" size={15} />
                ) : (
                  ''
                )}
              </div>
              <img src={logo} alt="Ploutos" width={23} height={23} />
              <div className="amount">
                <span className="reward-amount">{reward.amount}</span>
              </div>
            </div>
          ))}
        </div>
        {!checkedIn ? (
          <Link
            to="#"
            className={`claim-button mt-5 ${
              loading || checkedIn ? 'disabled' : ''
            }`}
            onClick={() => handleCheckIn(currentDay)}
          >
            {loading ? <Spinner /> : 'Claim Reward!'}
          </Link>
        ) : (
          ''
        )}
      </Container>
    </div>
  );
}

export default DailyReward;
