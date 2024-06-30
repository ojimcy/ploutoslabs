import { useContext, useEffect, useState } from 'react';

// import demoData from './demo_data';
import { WebappContext } from '../context/telegram';

export const useWebApp = () => {
  const { webapp } = useContext(WebappContext);

  return webapp;
};

export const useInitData = () => {
  const webApp = useWebApp();

  const [data, setData] = useState();

  useEffect(() => {
    if (!webApp) return;
    setData(webApp.initDataUnsafe);
    // setData(demoData);
  });

  return data;
};

export const useTelegramUser = () => {
  // const webApp = useWebApp();
  const data = useInitData();

  const [user, setUser] = useState();

  useEffect(() => {
    if (!data) return;
    // if(!verifyInitData(webApp.initData)) return;
    // TODO: verify init data with hash from telegram
    setUser(data.user);
  });

  return user;
};

export const useCurrentUser = () => {
  const context = useContext(WebappContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within a WebappProvider');
  }
  const { user, refreshUser } = context;
  return { user, refreshUser };
};

export const computeTokensToCliam = (currentUser) => {
  if (!currentUser) return 0;
  // Calculate tokens based on mining rate (assuming rate is per hour and max claim window of one hour)
  let lastClaimAt =
    new Date().getTime() - new Date(currentUser.lastClaimAt).getTime();
  const milliSocondPerHour = currentUser.miningFrequency * 60 * 60 * 1000;
  if (lastClaimAt > milliSocondPerHour) {
    lastClaimAt = milliSocondPerHour;
  }
  return currentUser.miningRate * (lastClaimAt / milliSocondPerHour);
};
