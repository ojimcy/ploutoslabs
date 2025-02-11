import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './checkout.css';

const PaymentMethodSelection = ({ onProceed }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');

  const handleMethodSelect = (method) => setSelectedMethod(method);

  return (
    <div className="payment-method-selection d-flex flex-column">
      <h2>Select Payment Method</h2>
      <div className="payment-options">
        <div
          className={`payment-card ${
            selectedMethod === 'wallet' ? 'selected' : ''
          }`}
          onClick={() => handleMethodSelect('wallet')}
        >
          <div className="payment-icon">💳</div>
          <div className="payment-title">Pay with Wallet</div>
        </div>
        <div
          className={`payment-card ${
            selectedMethod === 'crypto' ? 'selected' : ''
          }`}
          onClick={() => handleMethodSelect('crypto')}
        >
          <div className="payment-icon">💰</div>
          <div className="payment-title">Pay with Crypto</div>
        </div>
      </div>

      {selectedMethod === 'crypto' && (
        <div className="crypto-options">
          <label>
            Select Token:
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
            >
              <option value="">Choose a token</option>
              <option value="0x4200000000000000000000000000000000000006">Ether (ETH)</option>
            </select>
          </label>
          <label>
            Select Network:
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
            >
              <option value="">Choose a network</option>
              <option value="base">Base</option>
            </select>
          </label>
        </div>
      )}

      {selectedMethod && (
        <button
          className="proceed-button"
          onClick={() =>
            onProceed(selectedMethod, selectedToken, selectedNetwork)
          }
          disabled={
            selectedMethod === 'crypto' && (!selectedToken || !selectedNetwork)
          }
        >
          Confirm and Continue
        </button>
      )}
    </div>
  );
};
PaymentMethodSelection.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default PaymentMethodSelection;
