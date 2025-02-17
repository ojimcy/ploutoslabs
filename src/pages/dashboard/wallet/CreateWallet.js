import React, { useState, useRef } from 'react';
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
import { Link } from 'react-router-dom';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { useCurrentUser } from '../../../hooks/telegram';
import TransactionPin from '../../../components/auth/TransactionPin';
import { encryptAndSaveWallet } from '../../../lib/utils';
import ConfirmationPage from './confirmation';

import './wallets.css';

const CreateWallet = () => {
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(1);
  const [lable, setLable] = useState('');
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [confirmMnemonic, setConfirmMnemonic] = useState('');
  const [error, setError] = useState('');
  const [phraseInputs, setPhraseInputs] = useState(Array(12).fill(''));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setStep(3);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const words = pastedText.trim().toLowerCase().split(/\s+/);

    // Only process if we have exactly 12 words
    if (words.length === 12) {
      const newInputs = [...words];
      setPhraseInputs(newInputs);
      setConfirmMnemonic(words.join(' '));

      // Focus the last input after pasting
      inputRefs.current[11].focus();
    } else {
      toast.error('Please paste all 12 words of your recovery phrase');
    }
  };

  const handlePhraseInput = (index, value) => {
    const newInputs = [...phraseInputs];
    newInputs[index] = value.toLowerCase();
    setPhraseInputs(newInputs);
    setConfirmMnemonic(newInputs.join(' '));

    // Only auto-focus next input if we hit space or reach maxLength
    if (value.includes(' ') || value.length >= 12) {
      const cleanValue = value.replace(/\s+/g, '');
      newInputs[index] = cleanValue;
      setPhraseInputs(newInputs);

      if (index < 11) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !phraseInputs[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    }
  };

  const handleConfirmMnemonic = () => {
    if (mnemonic === confirmMnemonic) {
      handleCreateWallet();
    } else {
      setError('Recovery phrase does not match.');
    }
  };

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      // Create wallet from seed using viem
      const wallet = mnemonicToAccount(mnemonic);

      // Pass mnemonic to encryption function
      await encryptAndSaveWallet(
        wallet,
        password,
        currentUser.id,
        lable,
        undefined, // privateKeyHex
        mnemonic // Add this line
      );

      setStep(6);
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Failed to create wallet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="create-wallet">
      <h3>Create Wallet</h3>

      {step === 1 && (
        <div className="step-container">
          <TransactionPin
            title="Enter a 6 digit pin for this wallet"
            onSubmit={(pin) => {
              setPassword(pin);
              setStep(2);
            }}
          />
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <TransactionPin
            title="Confirm pin"
            onSubmit={(pin) => {
              if (pin !== password) {
                toast.error('Invalid confirm password');
                setStep(1);
                return;
              }
              handleGenerateMnemonic();
            }}
          />
        </div>
      )}

      {step === 3 && (
        <div className="step-container">
          <Alert color="warning">
            Please write down your recovery phrase and keep it in a safe place.
          </Alert>
          <div className="recovery-phrase-container">
            <div className="recovery-phrase">
              {mnemonic.split(' ').map((word, index) => (
                <div key={index} className="phrase-word">
                  <span>{index + 1}.</span>
                  {word}
                </div>
              ))}
            </div>
            <button
              className="copy-phrase"
              onClick={() => {
                navigator.clipboard.writeText(mnemonic);
                toast.success('Recovery phrase copied to clipboard');
              }}
            >
              <FaCopy /> Copy Recovery Phrase
            </button>
          </div>
          <Button onClick={() => setStep(4)} block>
            I&apos;ve Written It Down
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="step-container">
          <ConfirmationPage onContinue={() => setStep(5)} />
        </div>
      )}

      {step === 5 && (
        <div className="step-container">
          <Form>
            <FormGroup>
              <Label for="tag">Wallet Label</Label>
              <Input
                type="text"
                id="tag"
                value={lable}
                onChange={(e) => setLable(e.target.value)}
                placeholder="Enter a label for your wallet"
              />
            </FormGroup>
            <FormGroup>
              <Label>Confirm Recovery Phrase</Label>
              <div className="phrase-inputs-container" onPaste={handlePaste}>
                {Array(12)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      className="phrase-input"
                      value={phraseInputs[index]}
                      onChange={(e) => handlePhraseInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      placeholder={(index + 1).toString()}
                    />
                  ))}
              </div>
            </FormGroup>
            {error && <Alert color="danger">{error}</Alert>}
            <Button onClick={handleConfirmMnemonic} block disabled={loading}>
              {loading ? 'Creating Wallet...' : 'Create Wallet'}
            </Button>
          </Form>
        </div>
      )}

      {step === 6 && (
        <div className="step-container">
          <Alert color="success">
            Wallet created successfully! Your private key is securely stored.
          </Alert>
          <Button tag={Link} to="/dashboard/accounts" block>
            View My Wallets
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CreateWallet;
