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
import { toast } from 'react-hot-toast';
import {
  getTvProviders,
  getTvBouquets,
  verifyTvSmartCard,
} from '../../../lib/server';
import './utilities.css';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { TransactionTypes } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';
const TvSubscriptionPage = () => {
  const { updateUtilityTransaction } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [providers, setProviders] = useState([]);
  const [bouquets, setBouquets] = useState([]);
  const [provider, setProvider] = useState('');
  const [bouquet, setBouquet] = useState('');
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadingBouquets, setLoadingBouquets] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const result = await getTvProviders();
        setProviders(result);
      } catch (error) {
        toast.error(t('common.failedToLoadTvProviders'));
      }
    };

    loadProviders();
  }, [setProviders]);

  const handleProviderChange = async (providerId) => {
    setProvider(providerId);
    setBouquet('');
    setBouquets([]);
    setSmartCardNumber('');
    setCustomerName('');
    if (providerId) {
      setLoadingBouquets(true);
      try {
        const result = await getTvBouquets(providerId);
        setBouquets(result);
      } catch (error) {
        toast.error(t('common.failedToLoadBouquets'));
      } finally {
        setLoadingBouquets(false);
      }
    }
  };

  const handleSmartCardChange = async (cardNumber) => {
    setSmartCardNumber(cardNumber);
    setCustomerName('');
    if (cardNumber.length >= 10 && provider) {
      setLoadingCustomer(true);
      try {
        const result = await verifyTvSmartCard(cardNumber, provider);
        setCustomerName(result.customerName);
      } catch (error) {
        toast.error(t('common.failedToVerifySmartCard'));
      } finally {
        setLoadingCustomer(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bouquetObj = bouquets.find((b) => b.variation_code === bouquet);

    updateUtilityTransaction({
      serviceId: provider,
      variationCode: bouquet,
      smartCardNumber,
      amount: parseFloat(bouquetObj.variation_amount), // TODO: Check on the backend
      amountInNaira: parseFloat(bouquetObj.variation_amount) * 100,
      phoneNumber: phoneNumber.toString(),
      type: TransactionTypes.TvSubscription,
    });
    navigate('/dashboard/checkout');

    // Reset form
    setProvider('');
    setBouquet('');
    setSmartCardNumber('');
    setCustomerName('');
    setPhoneNumber('');
  };

  return (
    <Container className="tv-subscription-page">
      <Row>
        <Col md={6} className="mx-auto">
          <h3 className="text-center">{t('utilities.tvTitle')}</h3>
          <p className="text-center">
            {t('utilities.tvDescription')}
          </p>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="provider">{t('utilities.tvProvider')}</Label>
              <Input
                type="select"
                id="provider"
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="form-control"
              >
                <option value="">{t('utilities.selectProvider')}</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="smartCardNumber">{t('utilities.smartCardNumber')}</Label>
              <Input
                type="text"
                id="smartCardNumber"
                placeholder={t('utilities.smartCardNumberPlaceholder')}
                value={smartCardNumber}
                onChange={(e) => handleSmartCardChange(e.target.value)}
                className="form-control"
              />
              {loadingCustomer ? (
                <p>{t('common.verifyingSmartCard')}</p>
              ) : (
                customerName && <p>{t('utilities.customerName')}: {customerName}</p>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="bouquet">{t('utilities.bouquet')}</Label>
              <Input
                type="select"
                id="bouquet"
                value={bouquet}
                onChange={(e) => setBouquet(e.target.value)}
                disabled={!provider || loadingBouquets}
                className="form-control"
              >
                <option value="">{t('utilities.selectBouquet')}</option>
                {loadingBouquets ? (
                  <option disabled>{t('utilities.loadingBouquets')}</option>
                ) : (
                  bouquets.map((bouquet) => (
                    <option
                      key={bouquet.variation_code}
                      value={bouquet.variation_code}
                    >
                      {bouquet.name}
                    </option>
                  ))
                )}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="phoneNumber">{t('utilities.phoneNumber')}</Label>
              <Input
                type="text"
                id="phoneNumber"
                placeholder={t('utilities.enterPhoneNumberForNotification')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
            </FormGroup>

            <Button
              type="submit"
              color="primary"
              block
              disabled={
                !provider || !bouquet || !smartCardNumber // || !customerName
              }
            >
              {t('utilities.paySubscription')}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TvSubscriptionPage;
