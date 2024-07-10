import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import ReferralCard from '../../../components/airdrop/ReferralCard';
import StorageCard from '../../../components/airdrop/StorageCard';
import { computeTokensToCliam, useCurrentUser } from '../../../hooks/telegram';
import AirdropFooter from '../../../components/airdrop/AirdropFooter';

function Airdrop() {
  const currentUser = useCurrentUser();

  // Fill time in minutes and fill rate in RAIN per hour
  const fillTime = 1;
  const fillRate = 1250;
  const maxReceivableAmount = (fillTime / 60) * fillRate;

  const [currentAmount, setCurrentAmount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const updateAmount = () => {
      const amt = computeTokensToCliam(currentUser);
      setCurrentAmount(amt);
    };

    updateAmount(); // Initial update
    const interval = setInterval(updateAmount, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  console.log(maxReceivableAmount);
  return (
    <div className="airdrop-page">
      <Container>
        <div className="airdrop-main">
          <ReferralCard />

          <StorageCard />

          <div className="airdrop-balance d-flex flex-column justify-content-center align-items-center mt-5">
            <div className="to-claim">
              <h5>Amount to Claim:</h5>
              <span>{currentAmount?.toFixed(6)}</span>
            </div>
            <div className="balance">
              <p>
                Balance:{' '}
                <strong>
                  {currentUser ? currentUser.balance?.toFixed(6) : '0'} PLTL
                </strong>
              </p>
            </div>
          </div>
        </div>

        <AirdropFooter />
      </Container>
    </div>
  );
}

export default Airdrop;
