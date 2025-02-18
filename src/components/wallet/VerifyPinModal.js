import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import TransactionPin from '../auth/TransactionPin';
import './verifyPinModal.css';

const VerifyPinModal = ({ isOpen, toggle, onSubmit, error }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="verify-pin-modal">
      <ModalHeader toggle={toggle}>Verify PIN</ModalHeader>
      <ModalBody>
        <TransactionPin
          title="Enter your wallet PIN to view recovery phrase"
          onSubmit={onSubmit}
        />
        {error && (
          <Alert color="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </ModalBody>
    </Modal>
  );
};

VerifyPinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default VerifyPinModal;
