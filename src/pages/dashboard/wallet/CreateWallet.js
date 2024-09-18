import React, { useState } from 'react';
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from 'reactstrap';
import { generateMnemonic } from 'bip39';
import { mnemonicToAccount } from 'viem/accounts';

import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { useCurrentUser } from '../../../hooks/telegram';
import TransactionPin from '../../../components/auth/TransactionPin';
import { encryptAndSaveWallet } from '../../../lib/utils';
import ConfirmationPage from './confirmation';

const CreateWallet = () => {
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(1);
  const [lable, setLable] = useState('');
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [confirmMnemonic, setConfirmMnemonic] = useState('');
  const [error, setError] = useState('');

  const handleGenerateMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setStep(3);
  };

  const handleConfirmMnemonic = () => {
    if (mnemonic === confirmMnemonic) {
      handleCreateWallet();
    } else {
      setError('Recovery phrase does not match.');
    }
  };

  const handleCreateWallet = async () => {
    try {
      // Create wallet from seed using viem
      const wallet = mnemonicToAccount(mnemonic);

      await encryptAndSaveWallet(wallet, password, currentUser.id, lable);

      // Proceed to the next step
      setStep(6);
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Failed to create wallet.');
    }
  };

  return (
    <Container className="mt-4">
      <TelegramBackButton />
      <h3>Create Wallet</h3>
      {step === 1 && (
        <TransactionPin
          title={'Enter a 6 digit pin for this wallet'}
          onSubmit={(pin) => {
            setPassword(pin);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <TransactionPin
          title={'Confirm pin'}
          onSubmit={(pin) => {
            if (pin !== password) {
              alert('Invalid confirm password');
              setStep(1);
              return;
            }
            handleGenerateMnemonic();
          }}
        />
      )}

      {step === 3 && (
        <div>
          <Alert color="warning">
            Please write down your recovery phrase and keep it in a safe place.
          </Alert>
          <p>{mnemonic}</p>
          <Button onClick={() => setStep(4)}>Next</Button>
        </div>
      )}

      {step === 4 && (
        <ConfirmationPage onContinue={() => setStep(5)}/>
      )}

      {step === 5 && (
        <Form>
          <FormGroup>
            <Label for="tag">Tag</Label>
            <Input
              type="text"
              id="tag"
              value={lable}
              onChange={(e) => setLable(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="confirmMnemonic">Confirm Recovery Phrase</Label>
            <Input
              type="textarea"
              id="confirmMnemonic"
              value={confirmMnemonic}
              onChange={(e) => setConfirmMnemonic(e.target.value.toLowerCase())}
            />
          </FormGroup>
          {error && <Alert color="danger">{error}</Alert>}
          <Button onClick={handleConfirmMnemonic}>Confirm</Button>
        </Form>
      )}

      {step === 6 && (
        <Alert color="success">
          Wallet created successfully! Your private key is securely stored.
        </Alert>
      )}
    </Container>
  );
};

export default CreateWallet;
