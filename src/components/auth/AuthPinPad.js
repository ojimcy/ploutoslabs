import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './transaction.css';
import { useTranslation } from 'react-i18next';
function AuthPinPad({ onSubmit, loading = false }) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  const handleDigitClick = (digit) => {
    if (isConfirming) {
      if (confirmPin.length < 4) {
        setConfirmPin((prev) => prev + digit);
        setError('');
      }
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + digit);
        setError('');
      }
    }
  };

  const handleBackspace = () => {
    if (isConfirming) {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
    setError('');
  };

  const handleSubmit = () => {
    if (!isConfirming) {
      if (pin.length !== 4) {
        setError(t('auth.pleaseEnter4Digits'));
        return;
      }
      setIsConfirming(true);
      return;
    }

    if (confirmPin.length !== 4) {
      setError(t('auth.pleaseEnter4Digits'));
      return;
    }

    if (pin !== confirmPin) {
      setError(t('auth.pinMismatch'));
      setConfirmPin('');
      return;
    }

    onSubmit(pin);
  };

  const handleReset = () => {
    setPin('');
    setConfirmPin('');
    setIsConfirming(false);
    setError('');
  };

  return (
    <div className="auth-pin-pad">
      <h4 className="text-center mb-4">{t('auth.createPin')}</h4>
      <p className="text-center text-muted mb-4">
        {isConfirming ? t('auth.confirmPin') : t('auth.enter4DigitPin')}
      </p>

      <div className="pin-display mb-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`pin-digit ${
              (isConfirming ? confirmPin : pin).length > index ? 'filled' : ''
            }`}
          />
        ))}
      </div>

      {error && <div className="text-danger text-center mb-3">{error}</div>}

      <div className="pin-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            className="pin-button"
            onClick={() => handleDigitClick(digit)}
            disabled={loading}
          >
            {digit}
          </button>
        ))}
        <button
          className="pin-button function-button"
          onClick={handleReset}
          disabled={loading}
        >
          ↺
        </button>
        <button
          className="pin-button"
          onClick={() => handleDigitClick(0)}
          disabled={loading}
        >
          0
        </button>
        <button
          className="pin-button function-button"
          onClick={handleBackspace}
          disabled={loading}
        >
          ←
        </button>
      </div>

      <button
        className={`submit-button ${
          (isConfirming ? confirmPin : pin).length === 4 ? 'ready' : ''
        }`}
        onClick={handleSubmit}
        disabled={
          loading || (isConfirming ? confirmPin.length !== 4 : pin.length !== 4)
        }
      >
        {loading ? (
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : isConfirming ? (
          t('auth.confirmPin')
        ) : (
          t('common.next')
        )}
      </button>
    </div>
  );
}

AuthPinPad.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AuthPinPad;
