import React, { useState, useEffect } from 'react';
import './checkout.css';
import PropTypes from 'prop-types';

import { getUtilitiesTransactionDetails } from '../../../lib/server';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutConfirmation = ({ onDone }) => {
  const [status, setStatus] = useState('waiting');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const location = useLocation();
        const query = new URLSearchParams(location.search);
        const txID = query.get('txID');

        const result = await getUtilitiesTransactionDetails(txID);
        setDetails(result);
        setStatus('success');
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
        setStatus('failed');
      }
    };

    fetchTransactionDetails();
  }, []);

  if (status === 'waiting') {
    return (
      <div className="checkout-confirmation">
        <h2>Processing Transaction</h2>
        <div className="loader"></div>
        <p>Please wait while we process your transaction...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="checkout-confirmation">
        <h2>Transaction Successful</h2>
        <div className="transaction-details">
          <div className="details-item">
            <span>Transaction ID:</span>
            <span>{details.txID}</span>
          </div>
          <div className="details-item">
            <span>Amount:</span>
            <span>{details.amount}</span>
          </div>
          <div className="details-item">
            <span>Payment Method:</span>
            <span>{details.method}</span>
          </div>

          {/* Render utility-specific details */}
          {details.type === 'airtime' && (
            <>
              <div className="details-item">
                <span>Phone Number:</span>
                <span>{details.phoneNumber}</span>
              </div>
              <div className="details-item">
                <span>Network Provider:</span>
                <span>{details.networkProvider}</span>
              </div>
            </>
          )}

          {details.type === 'data' && (
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

          {details.type === 'electricity' && (
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

          {details.type === 'tv_subscription' && (
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
    );
  }

  return (
    <div className="checkout-confirmation">
      <h2>Transaction Failed</h2>
      <p>Something went wrong. Please try again.</p>
      <button className="done-button" onClick={onDone}>
        Retry
      </button>
    </div>
  );
};

CheckoutConfirmation.propTypes = {
  onDone: PropTypes.func.isRequired,
};

export default CheckoutConfirmation;
