import React, { useState, useEffect } from 'react';
import './checkout-summary.css';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { getUtilitiesTransactionDetails } from '../../../lib/server';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TransactionTypes, formatTransactionType } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';

const CheckoutConfirmation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        toast.error(t('common.errorOccurred'));
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
          <h2>{t('utilities.processingTransaction')}</h2>
          <div className="loader"></div>
          <p>{t('utilities.pleaseWait')}</p>
        </div>
      </Container>
    );
  }

  if (status === 'completed') {
    return (
      <Container>
        <div className="checkout-confirmation">
          <h2>{t('utilities.transactionSuccessful')}</h2>
          <div className="transaction-details">
            <div className="details-item">
              <span>{t('utilities.transactionId')}</span>
              <span>{details.id.substring(0, 10)}</span>
            </div>
            <div className="details-item">
              <span>{t('common.type')}</span>
              <span>{formatTransactionType(details.type)}</span>
            </div>
            <div className="details-item">
              <span>{t('common.amount')}</span>
              <span>₦{parseFloat(details.naira_amount) / 100}</span>
            </div>
            <div className="details-item">
              <span>{t('utilities.paymentMethod')}</span>
              <span>{details.paymentMethod}</span>
            </div>

            {/* Render utility-specific details */}
            {details.type === TransactionTypes.BuyAirtime && (
              <>
                <div className="details-item">
                  <span>{t('utilities.phoneNumber')}</span>
                  <span>{details.phone_number}</span>
                </div>
                <div className="details-item">
                  <span>{t('utilities.networkProvider')}</span>
                  <span>{details.network}</span>
                </div>
              </>
            )}

            {details.type === TransactionTypes.BuyData && (
              <>
                <div className="details-item">
                  <span>{t('utilities.phoneNumber')}</span>
                  <span>{details.phoneNumber}</span>
                </div>
                <div className="details-item">
                  <span>{t('utilities.dataPlan')}</span>
                  <span>{details.dataPlan}</span>
                </div>
              </>
            )}

            {details.type === TransactionTypes.BuyPower && (
              <>
                <div className="details-item">
                  <span>{t('utilities.meterNumber')}</span>
                  <span>{details.meterNumber}</span>
                </div>
                <div className="details-item">
                  <span>{t('utilities.provider')}</span>
                  <span>{details.provider}</span>
                </div>
              </>
            )}

            {details.type === TransactionTypes.TvSubscription && (
              <>
                <div className="details-item">
                  <span>{t('utilities.smartCardNumber')}</span>
                  <span>{details.smartCardNumber}</span>
                </div>
                <div className="details-item">
                  <span>{t('utilities.tvProvider')}</span>
                  <span>{details.tvProvider}</span>
                </div>
              </>
            )}

            {/* Common details for all utilities */}
            {details.token && (
              <>
                <div className="details-item">
                  <span>{t('utilities.token')}</span>
                  <span>{details.token}</span>
                </div>
                <div className="details-item">
                  <span>{t('utilities.network')}</span>
                  <span>{details.network}</span>
                </div>
              </>
            )}
          </div>
          <button className="done-button" onClick={onDone}>
            {t('common.done')}
          </button>
        </div>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container>
        <div className="checkout-confirmation failed">
          <h2>{t('utilities.transactionFailed')}</h2>
          <p>{t('common.somethingWentWrong')}</p>
          <button className="done-button" onClick={onDone}>
            {t('common.retry')}
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="checkout-confirmation">
        <h2>{t('common.loading')}</h2>
        <div className="loader"></div>
      </div>
    </Container>
  );
};

CheckoutConfirmation.propTypes = {
  onDone: PropTypes.func,
};

export default CheckoutConfirmation;
