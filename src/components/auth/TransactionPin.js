import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './transaction.css';

// Add rate limiting
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 300_000; // 5 minutes

function TransactionPin({ onSubmit, title }) {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const handleDigitClick = (digit) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = (pin) => {
    if (locked) return;

    try {
      onSubmit(pin);
      setAttempts(0);
    } catch (err) {
      if (attempts >= MAX_ATTEMPTS - 1) {
        setLocked(true);
        setTimeout(() => setLocked(false), LOCKOUT_DURATION);
      }
      setAttempts((a) => a + 1);
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
        <button className="pin-button submit" onClick={() => handleSubmit(pin)}>
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
