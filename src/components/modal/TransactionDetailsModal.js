/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FaCopy } from 'react-icons/fa';

const TransactionDetailsModal = ({ isOpen, toggle, transaction, onCopy }) => {
  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="transaction-details-modal"
    >
      <ModalHeader toggle={toggle}>Transaction Details</ModalHeader>
      <ModalBody>
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
      </ModalBody>
      <div className="modal-footer">
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
