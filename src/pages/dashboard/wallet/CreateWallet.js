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
import { createHash, randomBytes, createCipheriv } from 'crypto-browserify';
import { mnemonicToAccount } from 'viem/accounts';

import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { addUsersWallet } from '../../../lib/server';
import { useCurrentUser } from '../../../hooks/telegram';
import { addWallet } from '../../../lib/db';
import TransactionPin from '../../../components/auth/TransactionPin';

const CreateWallet = () => {
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [confirmMnemonic, setConfirmMnemonic] = useState('');
  const [error, setError] = useState('');

  const handleGenerateMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setStep(2);
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
      const privateKeyUint8Array = wallet.getHdKey().privateKey;

      // Convert Uint8Array to hex string
      const privateKeyHex = Array.from(privateKeyUint8Array)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

      // Encrypt the private key
      const key = createHash('sha256').update(password).digest();
      const iv = randomBytes(16);
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const encryptedPrivateKey = Buffer.concat([
        cipher.update(Buffer.from(privateKeyHex, 'hex')),
        cipher.final(),
      ]);
      const tag = cipher.getAuthTag();

      const walletData = {
        iv: iv.toString('hex'),
        id: iv.toString('hex'),
        privateKey: encryptedPrivateKey.toString('hex'),
        tag: tag.toString('hex'),
        address: wallet.address,
        networth: 'EVM',
      };

      // Store the encrypted private key in local storage
      localStorage.setItem('wallet', JSON.stringify(walletData));

      addWallet(walletData);
      // register the wallet address for the user
      await addUsersWallet(currentUser.id, wallet.address);

      // Proceed to the next step
      setStep(4);
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
        <TransactionPin title={'Enter a 6 digit pin'} onSubmit={pin => {
          setPassword(pin)
          handleGenerateMnemonic()
        }}/>
        // <Form>
        //   <FormGroup>
        //     <Label for="password">Enter Password</Label>
        //     <Input
        //       type="password"
        //       id="password"
        //       value={password}
        //       onChange={(e) => setPassword(e.target.value)}
        //     />
        //   </FormGroup>
        //   <Button onClick={handleGenerateMnemonic}>Next</Button>
        // </Form>
      )}

      {step === 2 && (
        <div>
          <Alert color="warning">
            Please write down your recovery phrase and keep it in a safe place.
          </Alert>
          <p>{mnemonic}</p>
          <Button onClick={() => setStep(3)}>Next</Button>
        </div>
      )}

      {step === 3 && (
        <Form>
          <FormGroup>
            <Label for="confirmMnemonic">Confirm Recovery Phrase</Label>
            <Input
              type="textarea"
              id="confirmMnemonic"
              value={confirmMnemonic}
              onChange={(e) => setConfirmMnemonic(e.target.value)}
            />
          </FormGroup>
          {error && <Alert color="danger">{error}</Alert>}
          <Button onClick={handleConfirmMnemonic}>Confirm</Button>
        </Form>
      )}

      {step === 4 && (
        <Alert color="success">
          Wallet created successfully! Your private key is securely stored.
        </Alert>
      )}
    </Container>
  );
};

export default CreateWallet;
