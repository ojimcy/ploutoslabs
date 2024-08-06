import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './transaction.css';

function TransactionPin({ onSubmit, title }) {
  const [pin, setPin] = useState('');

  const handleDigitClick = (digit) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === 6) {
      onSubmit(pin);
      setPin('');
    }
  };

  return (
    <div className="transaction-pin">
      <p>{title || 'Input your 6 digit PIN'}</p>
      <div className="pin-display">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="pin-digit">
            {pin[index] ? '*' : ''}
          </div>
        ))}
      </div>
      <div className="pin-pad w-80">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            className="pin-button"
            onClick={() => handleDigitClick(digit)}
          >
            {digit}
          </button>
        ))}
        <button className="pin-button backspace" onClick={handleBackspace}>
          &lt;
        </button>
        <button className="pin-button" onClick={() => handleDigitClick(0)}>
          0
        </button>
        <button className="pin-button submit" onClick={handleSubmit}>
          ✔
        </button>
      </div>
    </div>
  );
}

TransactionPin.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default TransactionPin;
