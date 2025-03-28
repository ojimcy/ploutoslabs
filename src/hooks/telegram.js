import { useContext } from 'react';

// import demoData from './demo_data';
import { WebappContext } from '../context/telegram';

export const useCurrentUser = () => {
  const { user } = useContext(WebappContext);
  return user;
};

export const computeTokensToClaim = (currentUser) => {
  if (!currentUser) return 0;
  // Calculate tokens based on mining rate (assuming rate is per hour and max claim window of one hour)
  let lastClaimAt =
    new Date().getTime() - new Date(currentUser.lastClaimAt).getTime();
  const milliSocondPerHour = currentUser.miningFrequency * 60 * 60 * 1000;
  if (lastClaimAt > milliSocondPerHour) {
    lastClaimAt = milliSocondPerHour;
  }
  return 10 * currentUser.miningRate * (lastClaimAt / milliSocondPerHour);
};

export const useReferralLink = (currentUser) => {
  if (!currentUser) return '';
  return `https://t.me/ploutos_labs_bot?start=${currentUser.telegramId}`;
};
