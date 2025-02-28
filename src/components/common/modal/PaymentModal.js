import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import BaseModal from '../modal/BaseModal';
import './modal.css';
import { useTranslation } from 'react-i18next';

const PaymentModal = ({ isOpen, toggle, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.paymentRequired')}
      className="main-modal"
    >
      <p>
        {t('modal.paymentRequiredMessage')}
      </p>
      <div className="d-flex justify-content-center">
        <Button onClick={onConfirm} color="primary">
          {t('modal.payAndPlay')}
        </Button>
      </div>
    </BaseModal>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default PaymentModal;
