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
import { TransactionTypes } from '../../../lib/utils';
import { FaCopy } from 'react-icons/fa';

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
      console.log(error);
      let msg = error?.response?.data?.error;
      toast.error(msg || 'An error occurred. Please try again later.');
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
        <h2>Transaction Summary</h2>
        <div className="summary-details">
          <div className="summary-item">
            <span>Utility Type</span>
            <span>{utilityTransaction.type}</span>
          </div>

          <div className="summary-item">
            <span>Payment Method:</span>
            <span>
              {utilityTransaction.method === 'wallet'
                ? 'Wallet'
                : 'Cryptocurrency'}
            </span>
          </div>

          <div className="summary-item">
            <span>Amount:</span>
            <span>₦{utilityTransaction.amount}</span>
          </div>

          {utilityTransaction.method === 'crypto' && (
            <>
              <div className="summary-item">
                <span>Token:</span>
                <span>{utilityTransaction.currency}</span>
              </div>
              <div className="summary-item">
                <span>Network:</span>
                <span>{utilityTransaction.currency_network}</span>
              </div>
              <div className="summary-item">
                <span>Token Amount:</span>
                <span>{utilityTransaction.token_amount}</span>
              </div>
            </>
          )}

          {/* Show details based on utility type */}
          {utilityTransaction.utilityType === TransactionTypes.BuyAirtime && (
            <>
              <div className="summary-item">
                <span>Phone Number:</span>
                <span>{utilityTransaction.phone_number}</span>
              </div>
              <div className="summary-item">
                <span>Network Provider:</span>
                <span>{utilityTransaction.network}</span>
              </div>
            </>
          )}

          {utilityTransaction.utilityType === TransactionTypes.BuyData && (
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

          {utilityTransaction.utilityType ===
            TransactionTypes.ElectricityBill && (
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

          {utilityTransaction.utilityType ===
            TransactionTypes.TvSubscription && (
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
              Send {cryptoTransactionDetails.token_amount}{' '}
              {cryptoTransactionDetails.currency} to the following address:
            </p>
            <div className="wallet-address">
              <strong>{cryptoTransactionDetails.wallet_address}</strong>
              <FaCopy
                className="copy-icon"
                onClick={() => {
                  navigator.clipboard.writeText(
                    cryptoTransactionDetails.wallet_address
                  );
                  toast.success('Copied to clipboard');
                }}
              />
            </div>
            <p>After sending, please click the button below to continue. </p>

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
  paymentMethod: PropTypes.string,
  token: PropTypes.string,
  network: PropTypes.string,
  amount: PropTypes.number,
  onConfirm: PropTypes.func,
};

export default TransactionSummary;
