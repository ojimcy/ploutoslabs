/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './checkout.css';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';

import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
function CryptoPayment({ onConfirm }) {
  const { t } = useTranslation();
  const [network, setNetwork] = useState('');
  const [token, setToken] = useState('');

  const handleConfirm = () => {
    if (network && token) {
      onConfirm();
    } else {
      toast.error(t('common.pleaseSelectNetworkAndToken'));
    }
  };

  return (
    <div>
      <Row>
        <Col md="12">
          <FormGroup>
            <Label for="cryptoNetwork">{t('utilities.networkProvider')}</Label>
            <Input
              type="select"
              id="cryptoNetwork"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="form-control"
            >
              <option value="">{t('utilities.selectNetwork')}</option>
              <option value="base">{t('common.base')}</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="token">{t('utilities.networkProvider')}</Label>
            <Input
              type="select"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="form-control"
            >
              <option value="">{t('modal.selectToken')}</option>
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
        {t('utilities.confirmPayment')}
      </button>
    </div>
  );
}

export default CryptoPayment;
