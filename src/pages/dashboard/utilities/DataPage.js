import React, { useContext, useState } from 'react';
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
import './utilities.css';
import { getServiceVariations } from '../../../lib/server';
import { toast } from 'react-toastify';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { TransactionTypes } from '../../../lib/utils';

const DataPage = () => {
  const { updateUtilityTransaction } = useContext(AppContext);
  const navigate = useNavigate();
  const [networkProvider, setNetworkProvider] = useState('');
  const [dataBundles, setDataBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const networkProviders = [
    { name: 'MTN', id: 'mtn-data' },
    { name: '9mobile', id: 'etisalat-data' },
    { name: 'Glo', id: 'glo-data' },
    { name: 'Airtel', id: 'airtel-data' },
  ];

  const onNetworkProviderChanged = async (newProvider) => {
    setNetworkProvider(newProvider);
    setDataBundles([]);
    setLoading(true);
    try {
      const variations = await getServiceVariations(newProvider);
      setDataBundles(variations);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch data bundles.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (!/^\d{11}$/.test(value)) {
      setPhoneError('Please enter a valid 11-digit phone number.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let selectedBundleObj;
    for (let i = 0; i < dataBundles.length; i++) {
      if (selectedBundle == dataBundles[i].variation_code) {
        selectedBundleObj = dataBundles[i];
      }
    }

    // Save transaction data to context
    updateUtilityTransaction({
      networkProvider,
      variationCode: selectedBundle,
      phoneNumber: phoneNumber.toString(),
      amount: selectedBundleObj.variation_amount,
      amountInNaira: selectedBundleObj.variation_amount, // TODO: recheck amount on the backend
      type: TransactionTypes.BuyData,
    });

    navigate('/dashboard/checkout');

    // Reset form fields
    setNetworkProvider('');
    setPhoneNumber('');
    setSelectedBundle('');
  };

  return (
    <Container className="data-page">
      <Row>
        <Col md={6} className="mx-auto">
          <h3 className="text-center">Buy Data</h3>
          <p className="text-center">
            Choose a network provider, bundle, and recipient phone number
          </p>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="networkProvider">Network Provider</Label>
              <Input
                type="select"
                id="networkProvider"
                value={networkProvider}
                onChange={(e) => onNetworkProviderChanged(e.target.value)}
                className="form-control"
              >
                <option value="">Select a network</option>
                {networkProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="dataBundle">Data Bundle</Label>
              <Input
                type="select"
                id="dataBundle"
                value={selectedBundle}
                onChange={(e) => setSelectedBundle(e.target.value)}
                className="form-control"
                disabled={!dataBundles.length}
              >
                <option value="">Select a data bundle</option>
                {dataBundles.map((bundle) => (
                  <option
                    key={bundle.variation_code}
                    value={bundle.variation_code}
                  >
                    {bundle.name} - ₦{bundle.variation_amount}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">Receiver&apos;s Phone Number</Label>
              <Input
                type="text"
                id="phoneNumber"
                pattern="[0-9]*"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                disabled={loading}
              />
            </FormGroup>
            {phoneError && <small className="text-danger">{phoneError}</small>}
            <Button
              type="submit"
              color="primary"
              block
              disabled={
                loading || !networkProvider || !selectedBundle || !phoneNumber
              }
            >
              {loading ? <Spinner size="sm" /> : 'Buy Data'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DataPage;
