/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './checkout.css';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';

function CryptoPayment({ onConfirm }) {
  const [network, setNetwork] = useState('');
  const [token, setToken] = useState('');

  const handleConfirm = () => {
    if (network && token) {
      onConfirm();
    } else {
      alert('Please select a network and token.');
    }
  };

  return (
    <div>
      <Row>
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

      {/* <Row>
        <Col
          md="12"
          className="d-flex justify-content-center align-items-center"
        >
          {network && token ? (
            <div>
              <p>
                <strong>Wallet Address:</strong>
              </p>
              <p className="wallet-address">
                {walletAddress} <FaCopy size={24} />
              </p>

              <p className="crypto-note">
                <strong>Note:</strong> Ensure you send the{' '}
                <strong>{cryptoToken}</strong> on the
                <strong> {cryptoNetwork}</strong> network to this address.
                Sending the wrong token or using the wrong network could result
                in the loss of funds.
              </p>
            </div>
          ) : (
            ''
          )}
        </Col>
      </Row> */}

      <button className="button-next" onClick={handleConfirm}>
        Confirm Payment
      </button>
    </div>
  );
}

export default CryptoPayment;
