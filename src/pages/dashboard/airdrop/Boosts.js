import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { getBoosters } from '../../../lib/server';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import BoostCard from '../../../components/airdrop/BoostCard';

import rainCrypt from '../../../assets/images/rain-crypt.png';
import './boosts.css'; 

function Boosts() {
  const currentUser = useCurrentUser();
  const [boosters, setBoosters] = useState([]);

  useEffect(() => {
    const fn = async () => {
      const b = await getBoosters();
      setBoosters(b);
    };

    fn();
  }, [setBoosters]);

  return (
    <>
      <TelegramBackButton />
      <Container className="boosts-container">
        <Container className="boosts-content">
          <Row>
            <Col className="total-balance-text">Total Balance:</Col>
          </Row>
          <Row>
            <Col>
              <div className="balance-value mt-3">
                {currentUser ? currentUser.balance?.toFixed(6) : '0'} GPLTL
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {currentUser && (
                <div className="mining-info-text mt-3">
                  Mining Rate: {currentUser.miningRate}; Mining Frequency:{' '}
                  {currentUser.miningFrequency}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            {boosters.map((b) => (
              <BoostCard
                key={b.id}
                id={b.id}
                image={rainCrypt}
                title={b.name}
                description={`${b.miningRate} GPLTL per ${b.miningFrequency} hours`}
                value={b.price}
              />
            ))}
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default Boosts;
