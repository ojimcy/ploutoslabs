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
import { buyData, getServiceVariations } from '../../../lib/server';
import { toast } from 'react-toastify';

const DataPage = () => {
  const [networkProvider, setNetworkProvider] = useState('');
  const [dataBundles, setDataBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const networkProviders = [
    { name: 'MTN', id: 'mtn-data' },
    { name: '9mobile', id: 'etisalat-data' },
    { name: 'Glo', id: 'glo-data' },
    { name: 'Airtel', id: 'airtel-data' },
  ];

  const onNetworkProviderChanged = async (newProvider) => {
    setNetworkProvider(newProvider);
    setDataBundles([]);
    const variations = await getServiceVariations(newProvider);
    setDataBundles(variations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let selectedBundleObj;
    for (let i = 0; i < dataBundles.length; i++) {
      if (selectedBundle == dataBundles[i].variation_code) {
        selectedBundleObj = dataBundles[i];
      }
    }

    const payload = {
      network: networkProvider,
      variationCode: selectedBundle,
      phoneNumber,
      amountIdNaira: selectedBundleObj.variation_amount,
    };
    try {
      const result = await buyData(payload);
      console.log(result);

      toast.success(
        `Data of ₦${selectedBundleObj.variation_amount} successfully purchased for ${phoneNumber} on ${networkProvider}`
      );
      setNetworkProvider('');
      setPhoneNumber('');
      setSelectedBundle('');
      
    } catch (error) {
      console.log(error);
      let msg = error?.response?.data?.error;
      toast.error(msg || 'An error occurred. Please try again later.');
    }
  };

  return (
    <Container className="data-page">
      <TelegramBackButton />
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
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
            </FormGroup>
            <Button type="submit" color="primary" block>
              Buy Data
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DataPage;
