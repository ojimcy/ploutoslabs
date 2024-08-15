import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import './game.css';
import { useCurrentUser } from '../../../hooks/telegram';
import data from '../../../hooks/demo_data';

function WaitingScreen() {
  const currentUser = useCurrentUser();
  const [timeLeft, setTimeLeft] = useState(120);
  const [opponentJoined, setOpponentJoined] = useState(false);

  const { opponent } = data;

  const onTimeout = ()=>{
    // notify user the oppenoe did not join
    // navigate back to game page 
  }

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
    <div className="waiting-screen">
      <Card className="user-card">
        <CardBody>
          <Row>
            <Col className="text-center">
              {currentUser.profilePic ? (
                <img src={currentUser.profilePic} alt={currentUser.username} />
              ) : (
                <span>{currentUser.username.charAt(0)}</span>
              )}
              <CardTitle>{currentUser?.username}</CardTitle>
            </Col>
            <Col className="text-center">
              {opponentJoined && opponent.profilePic ? (
                <img src={opponent.profilePic} alt={opponent.username} />
              ) : (
                <span>{opponent.username.charAt(0)}</span>
              )}
              <CardTitle>
                {opponentJoined ? opponent.username : 'Awaiting Opponent...'}
              </CardTitle>
            </Col>
          </Row>
          <div className="countdown-timer text-center">
            {opponentJoined
              ? "Opponent joined! Let's start."
              : `Time left for opponent to join: ${timeLeft}s`}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

WaitingScreen.propTypes = {
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

export default WaitingScreen;
