import React, { useState } from 'react';
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
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import './utilities.css';

const ElectricityBillPage = () => {
  const [provider, setProvider] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [meterType, setMeterType] = useState('');
  const [amount, setAmount] = useState('');

  const serviceProviders = [
    'Ikeja Electricity',
    'Eko Electricity',
    'Abuja Electricity',
    'Port Harcourt Electricity',
    'Kano Electricity',
    'Ibadan Electricity',
    'Enugu Electricity',
    'Jos Electricity',
    'Benin Electricity',
    'Aba Electricity',
  ];

  const meterTypes = ['Prepaid', 'Postpaid'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      provider,
      meterNumber,
      meterType,
      amount,
    };
    console.log('Electricity Bill Payment:', payload);
  };

  return (
    <Container className="electricity-bill-page">
      <TelegramBackButton />
      <Row>
        <Col md={6} className="mx-auto">
          <h3 className="text-center">Pay Electricity Bill</h3>
          <p className="text-center">
            Select a provider, enter your meter number, meter type, and amount
          </p>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="provider">Service Provider</Label>
              <Input
                type="select"
                id="provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="form-control"
              >
                <option value="">Select a provider</option>
                {serviceProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="meterNumber">Meter Number</Label>
              <Input
                type="text"
                id="meterNumber"
                placeholder="Enter meter number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <Label for="meterType">Meter Type</Label>
              <Input
                type="select"
                id="meterType"
                value={meterType}
                onChange={(e) => setMeterType(e.target.value)}
                className="form-control"
              >
                <option value="">Select meter type</option>
                {meterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="amount">Amount (₦)</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
              />
            </FormGroup>
            <Button type="submit" color="primary" block>
              Pay Bill
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ElectricityBillPage;
