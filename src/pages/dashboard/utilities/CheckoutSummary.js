import React, { useState, useEffect } from 'react';
import './checkout-summary.css';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { getUtilitiesTransactionDetails } from '../../../lib/server';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TransactionTypes, formatTransactionType } from '../../../lib/utils';

const CheckoutConfirmation = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [details, setDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const query = new URLSearchParams(location.search);
        const txID = query.get('txID');
        const result = await getUtilitiesTransactionDetails(txID);
        setDetails(result);
        setStatus(result.status);
      } catch (error) {
        console.error('Failed to fetch transaction details:', error);
        toast.error('An error occurred. Please try again later.');
        setStatus('failed');
      }
    };

    fetchTransactionDetails();

    const interval = setInterval(() => {
      if (!details) return;

      if (details.paymentMethod !== 'crypto' || details.status !== 'pending') {
        clearInterval(interval);
        return;
      }
      fetchTransactionDetails();
    }, 5000);

    return () => clearInterval(interval);
  }, [getUtilitiesTransactionDetails]);

  const onDone = () => {
    navigate('/dashboard/utilities');
  };

  if (status === 'pending') {
    return (
      <Container>
        <div className="checkout-confirmation">
          <h2>Processing Transaction</h2>
          <div className="loader"></div>
          <p>Please wait while we process your transaction...</p>
        </div>
      </Container>
    );
  }

  if (status === 'completed') {
    return (
      <Container>
        <div className="checkout-confirmation">
          <h2>Transaction Successful</h2>
          <div className="transaction-details">
            <div className="details-item">
              <span>Transaction ID</span>
              <span>{details.id.substring(0, 10)}</span>
            </div>
            <div className="details-item">
              <span>Type</span>
              <span>{formatTransactionType(details.type)}</span>
            </div>
            <div className="details-item">
              <span>Amount</span>
              <span>₦{parseFloat(details.naira_amount) / 100}</span>
            </div>
            <div className="details-item">
              <span>Payment Method</span>
              <span>{details.paymentMethod}</span>
            </div>

            {/* Render utility-specific details */}
            {details.type === TransactionTypes.BuyAirtime && (
              <>
                <div className="details-item">
                  <span>Phone Number:</span>
                  <span>{details.phone_number}</span>
                </div>
                <div className="details-item">
                  <span>Network Provider:</span>
                  <span>{details.network}</span>
                </div>
              </>
            )}

            {details.type === TransactionTypes.BuyData && (
              <>
                <div className="details-item">
                  <span>Phone Number:</span>
                  <span>{details.phoneNumber}</span>
                </div>
                <div className="details-item">
                  <span>Data Plan:</span>
                  <span>{details.dataPlan}</span>
                </div>
              </>
            )}

            {details.type === TransactionTypes.BuyPower && (
              <>
                <div className="details-item">
                  <span>Meter Number:</span>
                  <span>{details.meterNumber}</span>
                </div>
                <div className="details-item">
                  <span>Provider:</span>
                  <span>{details.provider}</span>
                </div>
              </>
            )}

            {details.type === TransactionTypes.TvSubscription && (
              <>
                <div className="details-item">
                  <span>Smart Card Number:</span>
                  <span>{details.smartCardNumber}</span>
                </div>
                <div className="details-item">
                  <span>TV Provider:</span>
                  <span>{details.tvProvider}</span>
                </div>
              </>
            )}

            {/* Common details for all utilities */}
            {details.token && (
              <>
                <div className="details-item">
                  <span>Token:</span>
                  <span>{details.token}</span>
                </div>
                <div className="details-item">
                  <span>Network:</span>
                  <span>{details.network}</span>
                </div>
              </>
            )}
          </div>
          <button className="done-button" onClick={onDone}>
            Done
          </button>
        </div>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container>
        <div className="checkout-confirmation failed">
          <h2>Transaction Failed</h2>
          <p>Something went wrong. Please try again.</p>
          <button className="done-button" onClick={onDone}>
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="checkout-confirmation">
        <h2>Loading...</h2>
        <div className="loader"></div>
      </div>
    </Container>
  );
};

CheckoutConfirmation.propTypes = {
  onDone: PropTypes.func,
};

export default CheckoutConfirmation;
