import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import './wallets.css';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { getWalletByAddress } from '../../../lib/db';
import { encryptAndSaveWallet } from '../../../lib/utils';
import TransactionPin from '../../../components/auth/TransactionPin';
import { useCurrentUser } from '../../../hooks/telegram';

const ImportWallet = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');

  const currentUser = useCurrentUser();

  const validateInput = (value) => {
    const seedPhraseRegex = /^(\w+\s){11,}\w+$/;
    const seedPhraseRegex24 = /^(\w+\s){23,}\w+$/;
    const privateKeyRegex = /^0x[a-fA-F0-9]{64}$/;

    if (seedPhraseRegex.test(value) || seedPhraseRegex24.test(value)) {
      setInputType('seedPhrase');
      setError('');
      return true;
    } else if (privateKeyRegex.test(value)) {
      setInputType('privateKey');
      setError('');
      return true;
    } else {
      setError('Input is not a valid seed phrase or private key.');
      return false;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value.toLowerCase());
    validateInput(e.target.value.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInput(inputValue)) {
      alert('Invalid input');
      return;
    }

    const account =
      inputType == 'seedPhrase'
        ? mnemonicToAccount(inputValue)
        : privateKeyToAccount(inputValue);

    const existingWallet = getWalletByAddress(account.address);
    if (existingWallet) {
      setError('The imported wallet exists');
      return;
    }

    encryptAndSaveWallet(account, password, currentUser.id)
  };

  return (
    <Container className="mt-4 import-wallet">
      <TelegramBackButton />
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <h2>Import Wallet</h2>

          {step == 1 && (
            <TransactionPin
              title={'Enter a 6 digit pin'}
              onSubmit={(pin) => {
                setPassword(pin);
                setStep(2)
              }}
            />
          )}

          {step == 2 && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="walletInput">
                  Enter Seed Phrase or Private Key
                </Label>
                <Input
                  type="textarea"
                  name="walletInput"
                  id="walletInput"
                  value={inputValue}
                  onChange={handleInputChange}
                  rows="4"
                  className="import-input"
                  placeholder="Seed phrase"
                />
                {error && <div className="error-text">{error}</div>}
              </FormGroup>
              <Button type="submit" color="primary">
                Import Wallet
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

ImportWallet.propTypes = {
  onImport: PropTypes.func,
};

export default ImportWallet;
