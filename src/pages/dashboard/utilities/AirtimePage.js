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
  Spinner,
} from 'reactstrap';
import { toast } from 'react-toastify';
import './utilities.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { buyAirtime } from '../../../lib/server';

const Airtime = () => {
  const [networkProvider, setNetworkProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const networkProviders = ['MTN', '9mobile', 'Glo', 'Airtel'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!networkProvider || !phoneNumber || !amount) {
      toast.error('Please fill in all fields!');
      return;
    }

    // if (!/^\d{11}$/.test(phoneNumber)) {
    //   toast.error('Please enter a valid 11-digit phone number.');
    //   return;
    // }

    if (amount <= 0) {
      toast.error('Amount should be greater than 0.');
      return;
    }

    setLoading(true);

    // Simulating a purchase process
    try {
      const result = await buyAirtime(
        networkProvider,
        phoneNumber,
        parseFloat(amount) * 100
      );
      console.log(result)

      toast.success(
        `Airtime of ₦${amount} successfully purchased for ${phoneNumber} on ${networkProvider}`
      );
      setNetworkProvider('');
      setPhoneNumber('');
      setAmount('');
    } catch (error) {
      console.log(error)
      let msg = error?.response?.data?.error
      toast.error(msg || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
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
                type="text"
                id="phoneNumber"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
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
            <Button color="primary" block type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Buy Airtime'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Airtime;
