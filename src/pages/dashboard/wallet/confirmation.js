import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import './confirmation.css';

import sec from '../../../assets/images/crypto-security.png';

const ConfirmationPage = ({onContinue}) => {
  const [checks, setChecks] = useState({
    check1: false,
    check2: false,
    check3: false,
  });

  const allChecked = checks.check1 && checks.check2 && checks.check3;

  const handleCheckChange = (event) => {
    const { name, checked } = event.target;
    setChecks({ ...checks, [name]: checked });
  };

  return (
    <div className="confirmation-page">
      <TelegramBackButton />
      <div className="confirmation-card">
        <div className="text-center">
          <img src={sec} alt="Wallet Security" className="confirmation-image" />
          <h2 className="confirmation-title">
            This secret phrase is the master key to your Ploutos Wallet
          </h2>
          <p className="confirmation-subtext">
            Tap on all checkboxes to confirm that you understand the importance
            of your secret phrase
          </p>
        </div>

        <Form>
          <FormGroup check className="confirmation-checkbox-group">
            <Label check className="confirmation-checkbox-label">
              <Input
                type="checkbox"
                name="check1"
                checked={checks.check1}
                onChange={handleCheckChange}
              />
              <span className="checkbox-text">
                Ploutos does not store or recover your secret phrase.
              </span>
            </Label>
          </FormGroup>
          <FormGroup check className="confirmation-checkbox-group">
            <Label check className="confirmation-checkbox-label">
              <Input
                type="checkbox"
                name="check2"
                checked={checks.check2}
                onChange={handleCheckChange}
              />
              <span className="checkbox-text">
                Never share your secret phrase with anyone. Ploutos Wallet will
                never ask for it.
              </span>
            </Label>
          </FormGroup>
          <FormGroup check className="confirmation-checkbox-group">
            <Label check className="confirmation-checkbox-label">
              <Input
                type="checkbox"
                name="check3"
                checked={checks.check3}
                onChange={handleCheckChange}
              />
              <span className="checkbox-text">
                Store your secret phrase securely offline. Digital storage is
                risky and not recommended.
              </span>
            </Label>
          </FormGroup>
        </Form>
        <Button
          color="primary"
          block
          onClick={onContinue}
          disabled={!allChecked}
          className="continue-button mt-3"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

export default ConfirmationPage;
