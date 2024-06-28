import React, { useContext, useEffect, useState } from 'react';
import { Button, Row, Col, Progress, Container } from 'reactstrap';
import { claimToken } from '../../lib/server';
import { computeTokensToCliam, useCurrentUser } from '../../hooks/telegram';
import { WebappContext } from '../../context/telegram';
import { getUserByTelegramID } from '../../lib/server';
import rain from '../../assets/images/water1.png';

import './airdrop.css';

function StorageCard() {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      if (progress < 100) {
        const amt = computeTokensToCliam(currentUser);
        setProgress((amt / currentUser.miningRate) * 100);
      }
    }, 1000); // Update progress every second

    return () => clearInterval(interval);
  }, [currentUser, progress]);

  const claim = async () => {
    await claimToken(currentUser.telegramId);
    const user = await getUserByTelegramID(currentUser.telegramId);
    setUser(user);
  };

  return (
    <div className="storage mt-5">
      <Container>
        <Progress
          value={progress}
          style={{
            borderRadius: '15px 15px 0 0',
            height: '5px',
            backgroundColor: '#ffd600',
            width: '106%',
            marginLeft: '-10px',
          }}
        />
        <Row className="align-items-center storage-card">
          <Col xs="auto">
            <img src={rain} alt="" width="35" height="35" />
          </Col>
          <Col>
            <h5 className="mb-0">Storage</h5>
            {currentUser && (
              <small className="minig-rate">
                {currentUser.miningRate} PLTL / {currentUser.miningFrequency}{' '}
                hour
              </small>
            )}
          </Col>
          <Col xs="auto">
            <Button color="primary" onClick={claim}>
              Claim
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default StorageCard;
