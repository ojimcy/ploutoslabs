import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import TransactionPin from '../auth/TransactionPin';
import BaseModal from '../common/modal/BaseModal';

const VerifyPinModal = ({ isOpen, toggle, onSubmit, error }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title="Verify PIN"
      className="verify-pin-modal"
    >
      <TransactionPin
        title="Enter your wallet PIN to view recovery phrase"
        onSubmit={onSubmit}
      />
      {error && (
        <Alert color="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </BaseModal>
  );
};

VerifyPinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default VerifyPinModal;
