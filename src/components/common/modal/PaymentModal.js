import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import BaseModal from '../modal/BaseModal';
import './modal.css';

const PaymentModal = ({ isOpen, toggle, onConfirm }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title="Payment Required"
      className="main-modal"
    >
      <p>
        You have already played your first solo game for today. To play again,
        you need to pay $0.1.
      </p>
      <div className="d-flex justify-content-center">
        <Button onClick={onConfirm} color="primary">
          Pay $0.1 and Play
        </Button>
      </div>
    </BaseModal>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default PaymentModal;
