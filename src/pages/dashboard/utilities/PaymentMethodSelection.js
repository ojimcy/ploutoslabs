import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './checkout.css';
import { useTranslation } from 'react-i18next';

const PaymentMethodSelection = ({ onProceed }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');

  const handleMethodSelect = (method) => setSelectedMethod(method);

  return (
    <div className="payment-method-selection d-flex flex-column">
      <h2>{t('utilities.selectPaymentMethod')}</h2>
      <div className="payment-options">
        <div
          className={`payment-card ${
            selectedMethod === 'wallet' ? 'selected' : ''
          }`}
          onClick={() => handleMethodSelect('wallet')}
        >
          <div className="payment-icon">💳</div>
          <div className="payment-title">{t('utilities.payWithWallet')}</div>
        </div>
        <div
          className={`payment-card ${
            selectedMethod === 'crypto' ? 'selected' : ''
          }`}
          onClick={() => handleMethodSelect('crypto')}
        >
          <div className="payment-icon">💰</div>
          <div className="payment-title">{t('utilities.payWithCrypto')}</div>
        </div>
      </div>

      {selectedMethod === 'crypto' && (
        <div className="crypto-options">
          <label>
            {t('utilities.selectToken')}:
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
            >
              <option value="">{t('utilities.chooseAToken')}</option>
              <option value="0x4200000000000000000000000000000000000006">Ether (ETH)</option>
            </select>
          </label>
          <label>
            {t('utilities.selectNetwork')}:
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
            >
              <option value="">{t('utilities.chooseANetwork')}</option>
              <option value="base">{t('common.base')}</option>
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
          {t('utilities.confirmAndContinue')}
        </button>
      )}
    </div>
  );
};
PaymentMethodSelection.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default PaymentMethodSelection;
