import React, { useState, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import { toast } from 'react-toastify';
import './utilities.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Airtime = () => {
  const navigate = useNavigate();
  const [networkProvider, setNetworkProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { updateUtilityTransaction } = useContext(AppContext);

  const networkProviders = ['MTN', '9mobile', 'Glo', 'Airtel'];

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (!/^\d{11}$/.test(value)) {
      setPhoneError('Please enter a valid 11-digit phone number.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Input validation
    if (!networkProvider || !phoneNumber || !amount) {
      toast.error('Please fill in all fields!');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount should be greater than 0.');
      return;
    }

    // Save transaction data to context
    updateUtilityTransaction({
      networkProvider,
      phoneNumber,
      amount,
      utilityType: 'airtime',
    });

    navigate('/dashboard/checkout');

    // Reset form fields
    setNetworkProvider('');
    setPhoneNumber('');
    setAmount('');
  };

  return (
    <Container className="airtime-page">
      <TelegramBackButton />
      <Row className="mt-5">
        <Col md={{ size: 6, offset: 3 }} className="text-center">
          <h3 className="mb-4">Buy Airtime</h3>
          <p>
            Select your network, enter your phone number, and amount to
            recharge.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={{ size: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="networkProvider">Network Provider</Label>
              <Input
                type="select"
                id="networkProvider"
                value={networkProvider}
                onChange={(e) => setNetworkProvider(e.target.value)}
                className="form-control"
              >
                <option value="">Select a network</option>
                {networkProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">Phone Number</Label>
              <Input
                type="tel"
                id="phoneNumber"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              {phoneError && (
                <small className="text-danger">{phoneError}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="amount">Amount (₦)</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                min={0}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormGroup>
            <Button color="primary" block>
              Proceed to Checkout
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Airtime;
