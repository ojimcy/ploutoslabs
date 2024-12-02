import { useEffect, useState } from 'react';

export const useCheckInStatus = (user) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (user) {
      const lastCheckInAt = new Date(user.lastCheckInAt);
      const today = new Date();
      const isSameDay = lastCheckInAt.toDateString() === today.toDateString();
      setCheckedIn(isSameDay);

      if (!isSameDay) {
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const interval = setInterval(() => {
          const diff = midnight - new Date();
          const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
          const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(
            2,
            '0'
          );
          const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(
            2,
            '0'
          );
          setCountdown(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [user]);

  return { checkedIn, countdown };
};
