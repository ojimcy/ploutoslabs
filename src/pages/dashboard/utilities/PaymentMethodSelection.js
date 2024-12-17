/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './checkout.css';
import { FaBitcoin, FaWallet } from 'react-icons/fa';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';

function PaymentMethodSelection({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [network, setNetwork] = useState('');
  const [token, setToken] = useState('');

  const handleSelect = (method) => {
    setSelected(method);
    onSelect(method);
  };

  return (
    <div>
      <div className="payment-grid">
        <div
          className={`payment-option ${
            selected === 'wallet' ? 'selected' : ''
          }`}
          onClick={() => handleSelect('wallet')}
        >
          <FaWallet />
          Wallet
        </div>
        <div
          className={`payment-option ${
            selected === 'crypto' ? 'selected' : ''
          }`}
          onClick={() => handleSelect('crypto')}
        >
          <FaBitcoin />
          Crypto
        </div>
      </div>
      {selected === 'crypto' && (
        <Row className="mt-3">
          <Col md="12">
            <FormGroup>
              <Label for="cryptoNetwork">Network Provider</Label>
              <Input
                type="select"
                id="cryptoNetwork"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="form-control"
              >
                <option value="">Select a network</option>
                <option value="base">Base</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="token">Network Provider</Label>
              <Input
                type="select"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="form-control"
              >
                <option value="">Select Token</option>
                <option value="base">Ploutos (PLTL)</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default PaymentMethodSelection;
