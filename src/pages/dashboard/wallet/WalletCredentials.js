import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa';
import './wallets.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

const wallet = {
  privateKey:
    '0xABC1234567890DEFABC1234567890DEFABC1234567890DEFABC1234567890DEF',
  seedPhrase: [
    'problem',
    'robust',
    'nasty',
    'matter',
    'unlock',
    'remind',
    'glass',
    'escape',
    'shift',
    'eyebrow',
    'deal',
    'neutral',
  ],
};

const WalletCredentials = () => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const toggleSeedPhraseVisibility = () => {
    setShowSeedPhrase(!showSeedPhrase);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  // Masked text for private key and seed phrase
  const maskText = (text) => '*'.repeat(text.length);

  return (
    <Container className="mt-4">
      <TelegramBackButton />
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <div className="credentials-card">
            <h2>Wallet Credentials</h2>

            {/* Private Key Section */}
            <div className="credentials-section">
              <div className="cred-top d-flex justify-content-between align-items-center">
                <h5>Private Key</h5>
                <div className="cred-actions">
                  <Button
                    onClick={togglePrivateKeyVisibility}
                    className="credentials-btn"
                  >
                    {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(wallet.privateKey)}
                    className="credentials-btn"
                  >
                    <FaCopy />
                  </Button>
                </div>
              </div>
              <div className="credentials-content mt-3">
                <textarea
                  value={
                    showPrivateKey
                      ? wallet.privateKey
                      : maskText(wallet.privateKey)
                  }
                  readOnly
                  className="credentials-input"
                  rows="3"
                />
              </div>
            </div>

            {/* Seed Phrase Section */}
            <div className="cred-actions d-flex justify-content-between align-items-center mt-3">
              <h5>Seed Phrase</h5>
              <div className="cred-actions">
                <Button
                  onClick={toggleSeedPhraseVisibility}
                  className="credentials-btn"
                >
                  {showSeedPhrase ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Button
                  onClick={() => copyToClipboard(wallet.seedPhrase.join(' '))}
                  className="credentials-btn"
                >
                  <FaCopy />
                </Button>
              </div>
            </div>
            <div className="seed-phrase-card mt-3">
              {/* Display Seed Phrase */}
              <Row className="seed-phrase-rows">
                <Col>
                  {wallet.seedPhrase.slice(0, 6).map((word, index) => (
                    <p key={index} className="seed-word">
                      {index + 1}. {showSeedPhrase ? word : '****'}
                    </p>
                  ))}
                </Col>
                <Col>
                  {wallet.seedPhrase.slice(6).map((word, index) => (
                    <p key={index} className="seed-word">
                      {index + 7}. {showSeedPhrase ? word : '****'}
                    </p>
                  ))}
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WalletCredentials;
