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
import { toast } from 'react-hot-toast';
import './utilities.css';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { NetworkProviders, TransactionTypes } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';

const Airtime = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [networkProvider, setNetworkProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { updateUtilityTransaction } = useContext(AppContext);

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
      phoneNumber: `${phoneNumber}`,
      amount,
      type: TransactionTypes.BuyAirtime,
    });

    navigate('/dashboard/checkout');

    // Reset form fields
    setNetworkProvider('');
    setPhoneNumber('');
    setAmount('');
  };

  return (
    <Container className="airtime-page">
      <Row className="mt-5">
        <Col md={{ size: 6, offset: 3 }} className="text-center">
          <h3 className="mb-4">{t('utilities.buyAirtime')}</h3>
          <p>{t('utilities.airtimePageDescription')}</p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={{ size: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="networkProvider">{t('utilities.airtimePageNetworkProvider')}</Label>
              <Input
                type="select"
                id="networkProvider"
                value={networkProvider}
                onChange={(e) => setNetworkProvider(e.target.value)}
                className="form-control"
              >
                <option value="">{t('utilities.selectNetworkProvider')}</option>
                {NetworkProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">{t('utilities.phoneNumber')}</Label>
              <Input
                type="text"
                id="phoneNumber"
                placeholder={t('utilities.enterPhoneNumber')}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              {phoneError && (
                <small className="text-danger">{phoneError}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="amount">{t('common.amount')}</Label>
              <Input
                type="number"
                id="amount"
                placeholder={t('utilities.enterAmount')}
                value={amount}
                min={50}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormGroup>
            <Button color="primary" block>
              {t('utilities.proceedToCheckout')}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Airtime;
