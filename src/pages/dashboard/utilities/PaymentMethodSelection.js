/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './checkout.css';
import { FaBitcoin, FaWallet } from 'react-icons/fa';

function PaymentMethodSelection({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (method) => {
    setSelected(method);
    onSelect(method);
  };

  return (
    <div className="payment-grid">
      <div
        className={`payment-option ${selected === 'wallet' ? 'selected' : ''}`}
        onClick={() => handleSelect('wallet')}
      >
        <FaWallet />
        Wallet
      </div>
      <div
        className={`payment-option ${selected === 'crypto' ? 'selected' : ''}`}
        onClick={() => handleSelect('crypto')}
      >
        <FaBitcoin />
        Crypto
      </div>
    </div>
  );
}

export default PaymentMethodSelection;
