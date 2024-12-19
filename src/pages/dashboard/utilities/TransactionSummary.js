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
import { toast } from 'react-toastify';
import { Button, Container } from 'reactstrap';
import { useCurrentUser } from '../../../hooks/telegram';
import { useNavigate } from 'react-router-dom';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

const TransactionSummary = () => {
  const currentUser = useCurrentUser();
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
        utilityType,
        token,
        network,
        amount,
        phoneNumber,
        meterNumber,
        smartCardNumber,
        dataPlan,
        networkProvider,
        provider,
      } = utilityTransaction;

      let result;

      // Conditionally call the correct API method based on utility type
      if (utilityType === 'airtime') {
        result = await buyAirtime(
          networkProvider,
          phoneNumber,
          parseFloat(amount),
          network,
          token
        );
      } else if (utilityType === 'data') {
        result = await buyData(
          phoneNumber,
          parseFloat(amount),
          networkProvider,
          dataPlan,
          token
        );
      } else if (utilityType === 'electricity') {
        result = await buyPower(
          meterNumber,
          parseFloat(amount),
          provider,
          token
        );
      } else if (utilityType === 'tv_subscription') {
        result = await payTvSubscription(
          smartCardNumber,
          parseFloat(amount),
          provider,
          token
        );
      }

      if (utilityTransaction.method === 'crypto') {
        setCryptoTransactionDetails({
          walletAddress: result.walletAddress,
          token: result.token,
          network: result.network,
          amount: result.amount,
        });
      } else {
        // Navigate to transaction details page after successful transaction
        navigate(`/dashboard/transaction-details/${result.txID}`);
      }
    } catch (error) {
      console.log(error);
      let msg = error?.response?.data?.error;
      toast.error(msg || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(`/dashboard/transaction-details/${cryptoTransactionDetails.txID}`);
  };

  return (
    <Container>
      <TelegramBackButton />

      <div className="transaction-summary">
        <h2>Transaction Summary</h2>
        <div className="summary-details">
          <div className="summary-item">
            <span>Utility Type</span>
            <span>{utilityTransaction.utilityType}</span>
          </div>

          <div className="summary-item">
            <span>Payment Method:</span>
            <span>
              {utilityTransaction.method === 'wallet'
                ? 'Wallet'
                : 'Cryptocurrency'}
            </span>
          </div>

          {utilityTransaction.method === 'crypto' && (
            <>
              <div className="summary-item">
                <span>Token:</span>
                <span>{utilityTransaction.token}</span>
              </div>
              <div className="summary-item">
                <span>Network:</span>
                <span>{utilityTransaction.network}</span>
              </div>
            </>
          )}
          <div className="summary-item">
            <span>Amount:</span>
            <span>₦{utilityTransaction.amount}</span>
          </div>

          {/* Show details based on utility type */}
          {utilityTransaction.utilityType === 'airtime' && (
            <>
              <div className="summary-item">
                <span>Phone Number:</span>
                <span>{utilityTransaction.phoneNumber}</span>
              </div>
              <div className="summary-item">
                <span>Network Provider:</span>
                <span>{utilityTransaction.networkProvider}</span>
              </div>
            </>
          )}

          {utilityTransaction.utilityType === 'data' && (
            <>
              <div className="summary-item">
                <span>Phone Number:</span>
                <span>{utilityTransaction.phoneNumber}</span>
              </div>
              <div className="summary-item">
                <span>Data Plan:</span>
                <span>{utilityTransaction.dataPlan}</span>
              </div>
            </>
          )}

          {utilityTransaction.utilityType === 'electricity' && (
            <>
              <div className="summary-item">
                <span>Meter Number:</span>
                <span>{utilityTransaction.meterNumber}</span>
              </div>
              <div className="summary-item">
                <span>Provider:</span>
                <span>{utilityTransaction.provider}</span>
              </div>
            </>
          )}

          {utilityTransaction.utilityType === 'tv_subscription' && (
            <>
              <div className="summary-item">
                <span>Smart Card Number:</span>
                <span>{utilityTransaction.smartCardNumber}</span>
              </div>
              <div className="summary-item">
                <span>TV Provider:</span>
                <span>{utilityTransaction.provider}</span>
              </div>
            </>
          )}
        </div>

        {/* Show wallet balance if method is wallet */}
        {utilityTransaction.method === 'wallet' && (
          <div className="wallet-balance-card">
            <h5>Wallet Balance</h5>
            <p>
              <strong>${currentUser?.gameWalletBalance}</strong>
            </p>
          </div>
        )}

        {/* If the method is crypto, show wallet address and instructions */}
        {cryptoTransactionDetails && (
          <div className="crypto-instructions">
            <p>
              Send {cryptoTransactionDetails.amount}{' '}
              {cryptoTransactionDetails.token} to the following address:
            </p>
            <p>
              <strong>{cryptoTransactionDetails.walletAddress}</strong>
            </p>
            <p>After sending, please click the button below to continue.</p>

            <div className="note">
              ⚠️ Ensure you send the correct token on the selected network to
              avoid loss of funds.
            </div>
            <Button className="confirm-button" onClick={handleContinue}>
              Continue
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
            Confirm and Checkout
          </Button>
        )}
      </div>
    </Container>
  );
};

TransactionSummary.propTypes = {
  paymentMethod: PropTypes.string.isRequired,
  token: PropTypes.string,
  network: PropTypes.string,
  amount: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default TransactionSummary;
