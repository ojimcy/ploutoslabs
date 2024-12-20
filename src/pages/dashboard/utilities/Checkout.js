import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import './checkout.css';
import {
  Container,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
} from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const { utilityTransaction, updateUtilityTransaction } =
    useContext(AppContext);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');

  const handleMethodSelect = (method) => setSelectedMethod(method);

  const handleContinue = () => {
    updateUtilityTransaction({
      ...utilityTransaction,
      token: selectedToken,
      network: selectedNetwork,
      paymentMethod: selectedMethod,
    });
    navigate('/dashboard/transaction-summary');
  };

  return (
    <Container>
      <TelegramBackButton />
      <div className="payment-method-selection">
        <h2>Select Payment Method</h2>
        <div className="payment-options">
          <div
            className={`payment-card ${
              selectedMethod === 'wallet' ? 'selected' : ''
            }`}
            onClick={() => handleMethodSelect('wallet')}
          >
            <div className="payment-icon">💳</div>
            <div className="payment-title">Pay with Wallet</div>
          </div>
          <div
            className={`payment-card ${
              selectedMethod === 'crypto' ? 'selected' : ''
            }`}
            onClick={() => handleMethodSelect('crypto')}
          >
            <div className="payment-icon">💰</div>
            <div className="payment-title">Pay with Crypto</div>
          </div>
        </div>

        {selectedMethod === 'crypto' && (
          <div className="crypto-options">
            <Row className="mt-3">
              <Col md="12">
                <FormGroup>
                  <Label for="cryptoNetwork">Network</Label>
                  <Input
                    type="select"
                    id="cryptoNetwork"
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select a network</option>
                    <option value="base">Base</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="token">Currency</Label>
                  <Input
                    type="select"
                    id="token"
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select Token</option>
                    <option value="ETH">Ether (ETH)</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </div>
        )}

        {selectedMethod && (
          <Button
            className="proceed-button"
            onClick={handleContinue}
            disabled={
              selectedMethod === 'crypto' &&
              (!selectedToken || !selectedNetwork)
            }
          >
            Confirm and Continue
          </Button>
        )}
      </div>
    </Container>
  );
};
Checkout.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default Checkout;
