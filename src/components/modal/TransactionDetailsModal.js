/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FaCopy } from 'react-icons/fa';
import BaseModal from '../common/modal/BaseModal';

const TransactionDetailsModal = ({ isOpen, toggle, transaction, onCopy }) => {
  if (!transaction) return null;

  const footerContent = (
    <Button color="secondary" onClick={toggle}>
      Close
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title="Transaction Details"
      className="transaction-details-modal"
      footerContent={footerContent}
    >
      <div className="transaction-details">
        <p>
          <strong>Type:</strong> {transaction.type}
        </p>
        <p>
          <strong>Date:</strong> {transaction.date}
        </p>
        <p>
          <strong>Status:</strong> {transaction.status}
        </p>
        {transaction.type === 'Electricity' && (
          <div>
            <p>
              <strong>Meter:</strong> {transaction.details.meter}
            </p>
            <p>
              <strong>Token:</strong>{' '}
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
            <strong>Plan:</strong> {transaction.details.plan}
          </p>
        )}
        {transaction.type === 'Airtime' && (
          <p>
            <strong>Amount:</strong> {transaction.details.amount}
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
