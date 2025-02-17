import React, { useContext, useEffect, useState } from 'react';
import { Container, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { FaPaperPlane, FaQrcode } from 'react-icons/fa';
import './token-detail.css';
import { Separator } from '../../../components/common/Seperator';
import { getWalletHIstory } from '../../../lib/server';
import TransactionCard from '../../../components/wallet/TransactionCard';

const TokenDetail = () => {
  const navigate = useNavigate();
  const { selectedToken } = useContext(AppContext);

  const [showActions, setShowActions] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    if (!selectedToken) {
      navigate('/dashboard');
      return;
    }
    // Animate actions after component mount
    const timer = setTimeout(() => setShowActions(true), 300);
    return () => clearTimeout(timer);
  }, [selectedToken, navigate]);

  useEffect(() => {
    if (!selectedToken) return;
    const fn = async () => {
      const response = await getWalletHIstory(selectedToken.address);
      const filteredTransactions = response.filter(
        (trx) => trx.symbol === selectedToken.symbol
      );
      setFilteredTransactions(filteredTransactions);
    };

    fn();
  }, [selectedToken]);

  if (!selectedToken) return null;

  const handleSend = () => navigate('/dashboard/send');
  const handleReceive = () => navigate('/dashboard/receive');

  return (
    <div className="token-detail-page">
      <Container>
        {/* Balance Section */}
        <div className="token-balance-section">
          <h4>Your Balance</h4>
          <div className="balance-details">
            <div className="token-amount-container">
              <p className="token-amount">
                {selectedToken.balance_formatted} {selectedToken.symbol}
              </p>
              <p className="fiat-value">
                $
                {(
                  selectedToken.balance_formatted * selectedToken.usd_price
                ).toFixed(2)}{' '}
                USD
              </p>
            </div>
            {/* logo */}
            <div className="token-logo-container">
              <img
                src={selectedToken.logo}
                alt={selectedToken.name}
                className="token-logo"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className={`token-actions ${showActions ? 'show' : ''} mt-4`}>
          <div className="action-buttons-container d-flex justify-content-between w-100">
            <Button
              className="action-button send-token-button"
              onClick={handleSend}
            >
              <FaPaperPlane />
              <span> Send</span>
            </Button>
            <Button
              className="action-button receive-token-button"
              onClick={handleReceive}
            >
              <FaQrcode />
              <span> Receive</span>
            </Button>
          </div>
        </div>

        <Separator />

        <TransactionCard transactions={filteredTransactions} />
      </Container>
    </div>
  );
};

export default TokenDetail;
