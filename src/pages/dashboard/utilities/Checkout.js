import React, { useState, useContext } from 'react';
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
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      <div className="payment-method-selection d-flex flex-column">
        <h2>{t('utilities.selectPaymentMethod')}</h2>
        <div className="payment-options">
          <div
            className={`payment-card ${
              selectedMethod === 'wallet' ? 'selected' : ''
            }`}
            onClick={() => handleMethodSelect('wallet')}
          >
            <div className="payment-icon">💳</div>
            <div className="payment-title">{t('utilities.payWithWallet')}</div>
          </div>
          <div
            className={`payment-card ${
              selectedMethod === 'crypto' ? 'selected' : ''
            }`}
            onClick={() => handleMethodSelect('crypto')}
          >
            <div className="payment-icon">💰</div>
            <div className="payment-title">{t('utilities.payWithCrypto')}</div>
          </div>
        </div>

        {selectedMethod === 'crypto' && (
          <div className="crypto-options">
            <Row className="mt-3">
              <Col md="12">
                <FormGroup>
                  <Label for="cryptoNetwork">{t('common.network')}</Label>
                  <Input
                    type="select"
                    id="cryptoNetwork"
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="form-control"
                  >
                    <option value="">{t('utilities.selectNetwork')}</option>
                    <option value="base">{t('common.base')}</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="token">{t('common.currency')}</Label>
                  <Input
                    type="select"
                    id="token"
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="form-control"
                  >
                    <option value="">{t('modal.selectToken')}</option>
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
            {t('utilities.confirmAndContinue')}
          </Button>
        )}
      </div>
    </Container>
  );
};
export default Checkout;
