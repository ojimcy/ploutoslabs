import React, { useState, useEffect } from 'react';
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

const DataPage = () => {
  const [networkProvider, setNetworkProvider] = useState('');
  const [dataBundles, setDataBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const networkProviders = ['MTN', '9mobile', 'Glo', 'Airtel'];

  // Dummy data bundles
  const dummyBundles = {
    MTN: [
      { id: '1', name: '500MB', price: 100 },
      { id: '2', name: '1GB', price: 200 },
      { id: '3', name: '2GB', price: 500 },
      { id: '4', name: '5GB', price: 1000 },
    ],
    '9mobile': [
      { id: '1', name: '250MB', price: 100 },
      { id: '2', name: '1.5GB', price: 300 },
      { id: '3', name: '3GB', price: 700 },
      { id: '4', name: '10GB', price: 2000 },
    ],
    Glo: [
      { id: '1', name: '1GB', price: 200 },
      { id: '2', name: '2GB', price: 500 },
      { id: '3', name: '4.5GB', price: 1000 },
      { id: '4', name: '10GB', price: 2500 },
    ],
    Airtel: [
      { id: '1', name: '500MB', price: 100 },
      { id: '2', name: '1GB', price: 200 },
      { id: '3', name: '3GB', price: 700 },
      { id: '4', name: '6GB', price: 1500 },
    ],
  };

  // Fetch data bundles from dummy data
  useEffect(() => {
    if (networkProvider) {
      setDataBundles(dummyBundles[networkProvider] || []);
    } else {
      setDataBundles([]);
    }
  }, [networkProvider]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      networkProvider,
      selectedBundle,
      phoneNumber,
    };
    console.log('Purchase Data:', payload);
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
                  <option key={bundle.id} value={bundle.id}>
                    {bundle.name} - ₦{bundle.price}
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
