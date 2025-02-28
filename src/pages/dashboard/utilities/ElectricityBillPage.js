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
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { TransactionTypes } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';
const ElectricityBillPage = () => {
  const navigate = useNavigate();
  const { updateUtilityTransaction } = useContext(AppContext);
  const { t } = useTranslation();

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
        toast.error(t('utilities.failedToVerifyMeterNumber'));
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
          <h3 className="text-center">{t('utilities.electricityBillTitle')}</h3>
          <p className="text-center">
            {t('utilities.payElectricityBillDescription')}
          </p>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="provider">{t('utilities.serviceProvider')}</Label>
              <Input
                type="select"
                id="provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="form-control"
              >
                <option value="">{t('utilities.selectAProvider')}</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="meterType">{t('utilities.meterType')}</Label>
              <Input
                type="select"
                id="meterType"
                value={meterType}
                onChange={(e) => setMeterType(e.target.value)}
                className="form-control"
              >
                <option value="">{t('utilities.selectMeterType')}</option>
                {meterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="meterNumber">{t('utilities.meterNumber')}</Label>
              <Input
                type="text"
                id="meterNumber"
                placeholder={t('utilities.enterMeterNumber')}
                value={meterNumber}
                onChange={(e) => onMeterNumberChanged(e.target.value)}
                className="form-control"
              />
              {loadingMeter ? (
                <p>{t('common.verifyingMeterNumber')}</p>
              ) : (
                <p>{customerName}</p>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="meterNumber">{t('utilities.phoneNumber')}</Label>
              <Input
                type="text"
                id="phoneNumber"
                placeholder={t('utilities.enterPhoneNumber')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumer(e.target.value)}
                className="form-control"
              />
            </FormGroup>

            <FormGroup>
              <Label for="amount">{t('common.amount')}</Label>
              <Input
                type="number"
                id="amount"
                placeholder={t('utilities.enterAmount')}
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
              {t('utilities.payBill')}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ElectricityBillPage;
