import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import BaseModal from '../modal/BaseModal';
import './modal.css';

function WithdrawModal({ isOpen, toggle, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!amount || !address) {
      setError('Both amount and destination address are required.');
      return;
    }

    // Clear the error and call the onSubmit function with the form data
    setError('');
    onSubmit(amount, address);
    toggle();
  };

  const footerContent = (
    <Button className="modal-btn-success" onClick={handleSubmit}>
      Submit
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title="Withdraw Funds"
      className="main-modal"
      footerContent={footerContent}
    >
      <Form>
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup>
          <Label for="withdrawAmount">Amount</Label>
          <Input
            type="number"
            id="withdrawAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            min="0"
          />
        </FormGroup>
        <FormGroup>
          <Label for="destinationAddress">Destination Address</Label>
          <Input
            type="text"
            id="destinationAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter destination address"
          />
        </FormGroup>
      </Form>
    </BaseModal>
  );
}

WithdrawModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default WithdrawModal;
