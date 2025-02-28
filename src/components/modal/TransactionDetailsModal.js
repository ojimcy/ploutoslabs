/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FaCopy } from 'react-icons/fa';
import BaseModal from '../common/modal/BaseModal';
import { useTranslation } from 'react-i18next';

const TransactionDetailsModal = ({ isOpen, toggle, transaction, onCopy }) => {
  const { t } = useTranslation();

  if (!transaction) return null;

  const footerContent = (
    <Button
      color="primary"
      onClick={() =>
        window.open(`https://basescan.org/tx/${transaction.hash}`, '_blank')
      }
    >
      {t('modal.viewOnExplorer')}
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.transactionDetails')}
      className="transaction-details-modal"
      footerContent={footerContent}
    >
      <div className="transaction-details">
        <p>
          <strong>{t('modal.type')}:</strong> {transaction.type}
        </p>
        <p>
          <strong>{t('modal.date')}:</strong> {transaction.date}
        </p>
        <p>
          <strong>{t('modal.status')}:</strong> {transaction.status}
        </p>
        {transaction.type === 'Electricity' && (
          <div>
            <p>
              <strong>{t('modal.meter')}:</strong> {transaction.details.meter}
            </p>
            <p>
              <strong>{t('modal.token')}:</strong>{' '}
              <span
                className="copyable-token"
                onClick={() => onCopy(transaction.details.token)}
              >
                {transaction.details.token}
              </span>
              <FaCopy
                className="copy-icon"
                onClick={() => onCopy(transaction.details.token)}
              />
            </p>
          </div>
        )}
        {transaction.type === 'Data' && (
          <p>
            <strong>{t('modal.plan')}:</strong> {transaction.details.plan}
          </p>
        )}
        {transaction.type === 'Airtime' && (
          <p>
            <strong>{t('comm.amount')}:</strong> {transaction.details.amount}
          </p>
        )}
      </div>
    </BaseModal>
  );
};

TransactionDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  transaction: PropTypes.object,
  onCopy: PropTypes.func.isRequired,
};

export default TransactionDetailsModal;
