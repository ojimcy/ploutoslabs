import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import data from '../../../hooks/demo_data';

import pltl from '../../../assets/images/logo.png';

import './game-detail.css';

function GameDetails() {
  const [timeLeft, setTimeLeft] = useState(120);
  const [opponentJoined, setOpponentJoined] = useState(false);

  const { user, opponent } = data;

  const onTimeout = () => {
    // notify user the oppenoe did not join
    // navigate back to game page
  };

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0 && !opponentJoined) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !opponentJoined) {
      onTimeout();
    }
  }, [timeLeft, opponentJoined, onTimeout]);

  useEffect(() => {
    // Simulate opponent joining
    const checkOpponentJoin = setTimeout(() => {
      // Replace this logic with actual opponent joining logic
      setOpponentJoined(true);
    }, 10000); // Simulate opponent joining after 10 seconds for demo

    return () => clearTimeout(checkOpponentJoin);
  }, []);

  return (
    <div className="detail-page">
      <div className="detail-card d-flex justify-content-between align-items-center">
        <div className="user d-flex align-items-center">
          <div className="user-avatar">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.username} />
            ) : (
              <span>{user.username.charAt(0)}</span>
            )}
          </div>

          <span>{user?.username}</span>
        </div>
        <div className="countdown-timer">{timeLeft} S</div>
        <div className="oponent d-flex align-items-center">
          <div className="user-avatar">
            {opponentJoined ? (
              opponent.profilePic ? (
                <img src={opponent.profilePic} alt={opponent.username} />
              ) : (
                <span>{opponent.username.charAt(0)}</span>
              )
            ) : (
              'W'
            )}
          </div>
          <div>{opponentJoined ? opponent.username : 'Waiting...'}</div>
        </div>
      </div>

      {/* Reward section */}
      <div className="game-reward d-flex flex-column justify-content-center align-items-center">
        <h6>Reward</h6>
        <div className="amount">
          <img src={pltl} alt="logo" /> +50,000
        </div>
      </div>
    </div>
  );
}

GameDetails.propTypes = {
  initiator: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  }).isRequired,
  opponent: PropTypes.shape({
    username: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  onTimeout: PropTypes.func.isRequired,
};

export default GameDetails;
