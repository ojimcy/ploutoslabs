import React, { useEffect, useState } from 'react';

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      return midnight.getTime() - now.getTime();
    };

    setTimeRemaining(calculateTimeUntilMidnight());

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTimeRemaining = prev - 1000;
        if (newTimeRemaining <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newTimeRemaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0'
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <span className="countdown">
      {timeRemaining !== null ? formatTime(timeRemaining) : ''}
    </span>
  );
};

export default CountdownTimer;
