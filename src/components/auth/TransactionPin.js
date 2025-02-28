import React, { useState } from 'react';
import './transaction.css';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// Add rate limiting
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 300_000; // 5 minutes
const PIN_LENGTH = 6;

function TransactionPin({ onSubmit, title }) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');

  const handleDigitClick = (digit) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(''); // Clear any previous error
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(''); // Clear any previous error
  };

  const validatePin = (pin) => {
    if (pin.length !== PIN_LENGTH) {
      setError(`PIN must be ${PIN_LENGTH} digits`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (pin) => {
    if (locked) return;

    if (!validatePin(pin)) {
      setPin('');
      return;
    }

    try {
      await onSubmit(pin);
      setAttempts(0);
      setPin(''); // Reset pin on success
      setError(''); // Clear any error
    } catch (err) {
      if (attempts >= MAX_ATTEMPTS - 1) {
        setLocked(true);
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setError(''); // Clear error when unlocked
        }, LOCKOUT_DURATION);
      }
      setAttempts((a) => a + 1);
      setPin(''); // Reset pin on error
      setError(
        `${t('auth.invalidPin')}. ${MAX_ATTEMPTS - attempts - 1} ${t('auth.attemptsRemaining')}`
      );
    }
  };

  return (
    <div className="transaction-pin">
      <p>{title || t('auth.input6DigitPin')}</p>
      <div className="pin-display">
        {[...Array(PIN_LENGTH)].map((_, index) => (
          <div key={index} className="pin-digit">
            {pin[index] ? '*' : ''}
          </div>
        ))}
      </div>
      {(error || locked) && (
        <p className="error-message">
          {locked
            ? t('auth.tooManyFailedAttempts')
            : error}
        </p>
      )}
      <div className="pin-pad w-80">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            className="pin-button"
            onClick={() => handleDigitClick(digit)}
            disabled={locked}
          >
            {digit}
          </button>
        ))}
        <button
          className="pin-button backspace"
          onClick={handleBackspace}
          disabled={locked}
        >
          &lt;
        </button>
        <button
          className="pin-button"
          onClick={() => handleDigitClick(0)}
          disabled={locked}
        >
          0
        </button>
        <button
          className="pin-button submit"
          onClick={() => handleSubmit(pin)}
          disabled={locked || pin.length !== PIN_LENGTH}
        >
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
