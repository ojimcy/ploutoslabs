import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import './confirmation.css';
import { useTranslation } from 'react-i18next';
import sec from '../../../assets/images/crypto-security.png';

const ConfirmationPage = ({onContinue}) => {
  const { t } = useTranslation();
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
      <div className="confirmation-card">
        <div className="text-center">
          <img src={sec} alt="Wallet Security" className="confirmation-image" />
          <h2 className="confirmation-title">
            {t('wallet.secretPhraseTitle')}
          </h2>
          <p className="confirmation-subtext">
            {t('wallet.secretPhraseSubtitle')}
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
                {t('wallet.secretPhraseCheckbox1')}
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
                {t('wallet.secretPhraseCheckbox2')}
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
                {t('wallet.secretPhraseCheckbox3')}
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
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

export default ConfirmationPage;
