import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';
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

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Withdraw Funds</ModalHeader>
      <ModalBody>
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
        <div className="action-buttons">
          <Button className="modal-btn-success" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

WithdrawModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default WithdrawModal;
