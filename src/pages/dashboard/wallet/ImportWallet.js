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
  Alert,
} from 'reactstrap';
import './wallets.css';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { getWalletByAddress } from '../../../lib/db';
import { encryptAndSaveWallet } from '../../../lib/utils';
import TransactionPin from '../../../components/auth/TransactionPin';
import { useCurrentUser } from '../../../hooks/telegram';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const ImportWallet = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [label, setLable] = useState('');

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
      setError(t('wallet.invalidPkInput'));
      return false;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value.toLowerCase());
    validateInput(e.target.value.toLowerCase());
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      if (!validateInput(inputValue)) {
        toast.error(t('wallet.invalidInput'));
        return;
      }

      const account =
        inputType == 'seedPhrase'
          ? mnemonicToAccount(inputValue)
          : privateKeyToAccount(inputValue);

      const existingWallet = getWalletByAddress(account.address);
      if (existingWallet && existingWallet.privateKey) {
        setError(t('wallet.walletExists'));
        return;
      }

      encryptAndSaveWallet(
        account,
        password,
        currentUser.id,
        label,
        inputValue
      );
      setStep(3);
    } catch (error) {
      setError('Error in importing wallet');
      console.log(error);
    }
  };

  return (
    <Container className="mt-4 import-wallet">
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <h2>{t('wallet.importWallet')}</h2>

          {step == 1 && (
            <TransactionPin
              title={t('wallet.enter6DigitPin')}
              onSubmit={(pin) => {
                setPassword(pin);
                setStep(2);
              }}
            />
          )}

          {step == 2 && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>{t('common.walletLabel')}</Label>
                <Input
                  name="lable"
                  id="lable"
                  value={label}
                  onChange={(e) => setLable(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="walletInput">{t('wallet.enterSeedPhraseOrPrivateKey')}</Label>
                <Input
                  type="textarea"
                  name="walletInput"
                  id="walletInput"
                  value={inputValue}
                  onChange={handleInputChange}
                  rows="4"
                  className="import-input"
                  placeholder={t('wallet.seedPhrase')}
                />
                {error && <div className="error-text">{error}</div>}
              </FormGroup>
              <Button type="submit" color="primary">
                {t('wallet.importWallet')}
              </Button>
            </Form>
          )}

          {step === 3 && (
            <div className="d-flex justify-content-center">
              <Alert color="success">
                {t('wallet.walletImportedSuccessfully')}
              </Alert>
              <Button
                color="primary"
                onClick={() => navigate('/dashboard/wallet')}
              >
                {t('wallet.returnToWallet')}
              </Button>
            </div>
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
