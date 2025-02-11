import React, { useContext, useEffect, useState } from 'react';
import { Button, Row, Col, Progress, Container } from 'reactstrap';
import { claimToken, getUserByTelegramID } from '../../lib/server';
import { computeTokensToClaim, useCurrentUser } from '../../hooks/telegram';
import { WebappContext } from '../../context/telegram';
import { FaWater } from 'react-icons/fa';
import './airdrop.css';

function StorageCard() {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      if (progress < 100) {
        const amt = computeTokensToClaim(currentUser);
        setProgress((amt / currentUser.miningRate) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, progress]);

  const claim = async () => {
    try {
      setLoading(true);
      await claimToken(currentUser.telegramId);
      const user = await getUserByTelegramID(currentUser.telegramId);
      setUser(user);
    } catch (error) {
      console.error('Error claiming tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storage-card-wrapper">
      <Container>
        <div className="storage-card">
          <Progress value={progress} className="storage-progress" />
          <Row className="storage-content">
            <Col xs="auto" className="storage-icon">
              <FaWater className="water-icon" />
            </Col>
            <Col className="storage-info">
              <h5 className="storage-title">Storage</h5>
              {currentUser && (
                <div className="mining-rate">
                  {currentUser.miningRate} PLTL / {currentUser.miningFrequency}h
                </div>
              )}
            </Col>
            <Col xs="auto" className="storage-action">
              <Button
                className="claim-button"
                onClick={claim}
                disabled={loading}
              >
                {loading ? 'Claiming...' : 'Claim'}
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default StorageCard;
