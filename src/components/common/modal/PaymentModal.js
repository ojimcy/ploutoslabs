import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import './modal.css';

// eslint-disable-next-line react/prop-types
const PaymentModal = ({ isOpen, toggle, onConfirm }) => {
  return (
    <Modal className="main-modal" isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Payment Required</ModalHeader>
      <ModalBody>
        <p>
          You have already played your first solo game for today. To play again,
          you need to pay $0.1.
        </p>
        <div className="d-flex justify-content-center">
          <Button onClick={onConfirm} color="primary">
            Pay $0.1 and Play
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default PaymentModal;
