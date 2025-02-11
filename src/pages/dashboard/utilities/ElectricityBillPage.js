import React, { useContext, useEffect, useState } from 'react';
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
import './utilities.css';
import {
  getElectricityProviders,
  verifyMeterNumber,
} from '../../../lib/server';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { TransactionTypes } from '../../../lib/utils';

const ElectricityBillPage = () => {
  const navigate = useNavigate();
  const { updateUtilityTransaction } = useContext(AppContext);

  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [meterType, setMeterType] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumer] = useState('');
  const [loadingMeter, setLoadingMeter] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await getElectricityProviders();
      setProviders(result);
    };

    load();
  }, [setProviders]);

  const meterTypes = ['Prepaid', 'Postpaid'];

  const onMeterNumberChanged = async (newMeterNumber) => {
    setMeterNumber(newMeterNumber);
    setCustomerName('');
    if (newMeterNumber.length == 13 && provider && meterType) {
      setLoadingMeter(true);
      try {
        const result = await verifyMeterNumber(
          newMeterNumber,
          provider,
          meterType
        );
        setCustomerName(result.customerName);
      } catch (error) {
        toast.error('Failed to verify meter number. Please try again.');
      } finally {
        setLoadingMeter(false);
      }
    }
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^(0|\+234)[7-9][0-1]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    updateUtilityTransaction({
      serviceId: provider,
      meterNumber,
      serviceType: meterType,
      amount: amount,
      type: TransactionTypes.BuyPower,
      phoneNumber,
    });

    navigate('/dashboard/checkout');
    setProvider('');
    setMeterNumber('');
    setAmount('');
    setMeterType('');
    setPhoneNumer('');
  };

  return (
    <Container className="electricity-bill-page">
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
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </Input>
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
              <Label for="meterNumber">Meter Number</Label>
              <Input
                type="text"
                id="meterNumber"
                placeholder="Enter meter number"
                value={meterNumber}
                onChange={(e) => onMeterNumberChanged(e.target.value)}
                className="form-control"
              />
              {loadingMeter ? (
                <p>Verifying meter number...</p>
              ) : (
                <p>{customerName}</p>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="meterNumber">Phone Number</Label>
              <Input
                type="text"
                id="phoneNumber"
                placeholder="Enter phone number for notification"
                value={phoneNumber}
                onChange={(e) => setPhoneNumer(e.target.value)}
                className="form-control"
              />
            </FormGroup>

            <FormGroup>
              <Label for="amount">Amount (₦)</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                min={800}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
              />
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              block
              disabled={
                !provider ||
                !meterNumber ||
                !meterType ||
                !amount ||
                !customerName
              }
            >
              Pay Bill
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ElectricityBillPage;
