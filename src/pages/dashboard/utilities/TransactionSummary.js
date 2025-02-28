import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import './checkout.css';

import { AppContext } from '../../../context/AppContext';
import {
  buyAirtime,
  buyData,
  buyPower,
  payTvSubscription,
} from '../../../lib/server'; // Importing all necessary functions
import { toast } from 'react-hot-toast';
import { Button, Container } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { useNavigate } from 'react-router-dom';
import { TransactionTypes, formatTransactionType } from '../../../lib/utils';
import { FaCopy } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
const TransactionSummary = () => {
  const currentUser = useCurrentUser();
  const { t } = useTranslation();
  const { utilityTransaction } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cryptoTransactionDetails, setCryptoTransactionDetails] =
    useState(null);

  // Handle checkout for any utility type
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const {
        type: utilityType,
        token,
        network,
        amount,
        phoneNumber,
        meterNumber,
        smartCardNumber,
        variationCode,
        networkProvider,
        serviceId,
        serviceType,
        paymentMethod,
      } = utilityTransaction;

      let result;

      // Conditionally call the correct API method based on utility type
      if (utilityType === TransactionTypes.BuyAirtime) {
        result = await buyAirtime({
          network: networkProvider,
          phoneNumber,
          amountInNaira: parseFloat(amount) * 100,
          currencyNetwork: network,
          currency: token,
          paymentMethod,
        });
      } else if (utilityType === TransactionTypes.BuyData) {
        result = await buyData({
          phoneNumber,
          amountInNaira: parseFloat(amount) * 100,
          network: networkProvider,
          variationCode,
          currency: token,
          paymentMethod,
        });
      } else if (utilityType === TransactionTypes.BuyPower) {
        result = await buyPower({
          meterNumber,
          amountInNaira: parseFloat(amount) * 100,
          serviceId,
          serviceType,
          currency: token,
          paymentMethod,
          phoneNumber,
        });
      } else if (utilityType === TransactionTypes.TvSubscription) {
        result = await payTvSubscription({
          cardNumber: smartCardNumber,
          amountInNaira: parseFloat(amount) * 100,
          serviceId,
          packageId: variationCode,
          phoneNumber,
          currency: token,
          paymentMethod,
        });
      }

      if (utilityTransaction.paymentMethod === 'crypto') {
        setCryptoTransactionDetails(result);
      } else {
        // Navigate to transaction details page after successful transaction
        navigate(`/dashboard/transaction-details?txID=${result.id}`);
      }
    } catch (error) {
      console.error(error);
      let msg = error?.response?.data?.error;
      toast.error(msg || t('common.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(
      `/dashboard/transaction-details?txID=${cryptoTransactionDetails.id}`
    );
  };

  return (
    <Container>
      <div className="transaction-summary">
        <h2>{t('utilities.transactionSummary')}</h2>
        <div className="summary-details">
          <div className="summary-item">
            <span>{t('utilities.utility')}</span>
            <span>{formatTransactionType(utilityTransaction.type)}</span>
          </div>

          <div className="summary-item">
            <span>{t('utilities.paymentMethod')}</span>
            <span>
              {utilityTransaction.method === 'wallet'
                ? t('common.wallet')
                : t('common.cryptocurrency')}
            </span>
          </div>

          <div className="summary-item">
            <span>{t('common.amount')}:</span>
            <span>₦{utilityTransaction.amount}</span>
          </div>

          {utilityTransaction.method === 'crypto' && (
            <>
              <div className="summary-item">
                <span>{t('common.token')}:</span>
                <span>{utilityTransaction.currency}</span>
              </div>
              <div className="summary-item">
                <span>{t('common.network')}:</span>
                <span>{utilityTransaction.currency_network}</span>
              </div>
              <div className="summary-item">
                <span>{t('common.tokenAmount')}:</span>
                <span>{utilityTransaction.token_amount}</span>
              </div>
            </>
          )}

          {/* Show details based on utility type */}
          {utilityTransaction.utilityType === TransactionTypes.BuyAirtime && (
            <>
              <div className="summary-item">
                <span>{t('utilities.phoneNumber')}:</span>
                <span>{utilityTransaction.phone_number}</span>
              </div>
              <div className="summary-item">
                <span>{t('utilities.networkProvider')}:</span>
                <span>{utilityTransaction.network}</span>
              </div>
            </>
          )}

          {utilityTransaction.utilityType === TransactionTypes.BuyData && (
            <>
              <div className="summary-item">
                <span>{t('utilities.phoneNumber')}:</span>
                <span>{utilityTransaction.phoneNumber}</span>
              </div>
              <div className="summary-item">
                <span>{t('utilities.dataPlan')}:</span>
                <span>{utilityTransaction.dataPlan}</span>
              </div>
            </>
          )}

          {utilityTransaction.utilityType ===
            TransactionTypes.ElectricityBill && (
            <>
              <div className="summary-item">
                <span>{t('utilities.meterNumber')}:</span>
                <span>{utilityTransaction.meterNumber}</span>
              </div>
              <div className="summary-item">
                <span>{t('utilities.provider')}:</span>
                <span>{utilityTransaction.provider}</span>
              </div>
            </>
          )}

          {utilityTransaction.utilityType ===
            TransactionTypes.TvSubscription && (
            <>
              <div className="summary-item">
                <span>{t('utilities.smartCardNumber')}:</span>
                <span>{utilityTransaction.smartCardNumber}</span>
              </div>
              <div className="summary-item">
                <span>{t('utilities.tvProvider')}:</span>
                <span>{utilityTransaction.provider}</span>
              </div>
            </>
          )}
        </div>

        {/* Show wallet balance if method is wallet */}
        {utilityTransaction.method === 'wallet' && (
          <div className="wallet-balance-card">
            <h5>{t('common.walletBalance')}</h5>
            <p>
              <strong>${currentUser?.gameWalletBalance}</strong>
            </p>
          </div>
        )}

        {/* If the method is crypto, show wallet address and instructions */}
        {cryptoTransactionDetails && (
          <div className="crypto-instructions">
            <p>
              {t('common.send')} {cryptoTransactionDetails.token_amount}{' '}
              {cryptoTransactionDetails.currency} {t('utilities.toAddress')}
            </p>
            <div className="wallet-address">
              <strong>{cryptoTransactionDetails.wallet_address}</strong>
              <FaCopy
                className="copy-icon"
                onClick={() => {
                  navigator.clipboard.writeText(
                    cryptoTransactionDetails.wallet_address
                  );
                  toast.success(t('common.copiedToClipboard'));
                }}
              />
            </div>
            <p>{t('utilities.afterSending')}</p>

            <div className="note">
              {t('utilities.sendNote')}
            </div>
            <Button className="confirm-button" onClick={handleContinue}>
              {t('common.continue')}
            </Button>
          </div>
        )}

        {/* If not crypto, show the normal checkout button */}
        {!cryptoTransactionDetails && (
          <Button
            className="confirm-button"
            disabled={loading}
            onClick={handleCheckout}
          >
            {t('utilities.confirmAndCheckout')}
          </Button>
        )}
      </div>
    </Container>
  );
};

TransactionSummary.propTypes = {
  paymentMethod: PropTypes.string,
  token: PropTypes.string,
  network: PropTypes.string,
  amount: PropTypes.number,
  onConfirm: PropTypes.func,
};

export default TransactionSummary;
