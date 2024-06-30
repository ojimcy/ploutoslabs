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
import './wallets.css';

const ImportWallet = ({ onImport }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState(null);
  const [error, setError] = useState('');

  const validateInput = (value) => {
    const seedPhraseRegex = /^(\w+\s){11,}\w+$/;
    const privateKeyRegex = /^0x[a-fA-F0-9]{64}$/;

    if (seedPhraseRegex.test(value)) {
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
    setInputValue(e.target.value);
    validateInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput(inputValue)) {
      onImport(inputValue, inputType);
    }
  };

  return (
    <Container className="mt-4 import-wallet">
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <h2>Import Wallet</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="walletInput">Enter Seed Phrase or Private Key</Label>
              <Input
                type="textarea"
                name="walletInput"
                id="walletInput"
                value={inputValue}
                onChange={handleInputChange}
                rows="4"
                className="import-input"
                placeholder='Seed phrase'
              />
              {error && <div className="error-text">{error}</div>}
            </FormGroup>
            <Button type="submit" color="primary">
              Import Wallet
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

ImportWallet.propTypes = {
  onImport: PropTypes.func,
};

export default ImportWallet;
