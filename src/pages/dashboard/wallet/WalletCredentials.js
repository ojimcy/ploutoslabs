import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa';
import './wallets.css';

const wallet = {
  privateKey:
    '0xABC1234567890DEFABC1234567890DEFABC1234567890DEFABC1234567890DEF',
  seedPhrase:
    'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
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

  return (
    <Container className="mt-4">
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Card>
            <CardBody>
              <h2>Wallet Credentials</h2>
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
                    type={showPrivateKey ? 'text' : 'password'}
                    value={wallet.privateKey}
                    readOnly
                    className="credentials-input"
                    rows="3"
                  />
                </div>
              </div>
              <div className="credentials-section mt-3">
                <div className="cred-top d-flex justify-content-between align-items-center">
                  <h5>Seed Phrase</h5>
                  <div className="cred-actions">
                    <Button
                      onClick={toggleSeedPhraseVisibility}
                      className="credentials-btn"
                    >
                      {showSeedPhrase ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(wallet.seedPhrase)}
                      className="credentials-btn"
                    >
                      <FaCopy />
                    </Button>
                  </div>
                </div>
                <div className="credentials-content mt-3">
                  <textarea
                    type={showSeedPhrase ? 'text' : 'password'}
                    value={wallet.seedPhrase}
                    readOnly
                    className="credentials-input"
                    rows="3"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WalletCredentials;
