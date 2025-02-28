import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import BaseModal from '../modal/BaseModal';
import './modal.css';
import { useTranslation } from 'react-i18next';
function WithdrawModal({ isOpen, toggle, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const handleSubmit = () => {
    // Basic validation
    if (!amount || !address) {
      setError(t('modal.bothAmountAndDestinationAddressAreRequired'));
      return;
    }

    // Clear the error and call the onSubmit function with the form data
    setError('');
    onSubmit(amount, address);
    toggle();
  };

  const footerContent = (
    <Button className="modal-btn-success" onClick={handleSubmit}>
      {t('common.submit')}
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.withdrawFunds')}
      className="main-modal"
      footerContent={footerContent}
    >
      <Form>
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup>
          <Label for="withdrawAmount">{t('common.amount')}</Label>
          <Input
            type="number"
            id="withdrawAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('modal.enterAmountToWithdraw')}
            min="0"
          />
        </FormGroup>
        <FormGroup>
          <Label for="destinationAddress">{t('modal.destinationAddress')}</Label>
          <Input
            type="text"
            id="destinationAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t('modal.enterDestinationAddress')}
          />
        </FormGroup>
      </Form>
    </BaseModal>
  );
}

WithdrawModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default WithdrawModal;
