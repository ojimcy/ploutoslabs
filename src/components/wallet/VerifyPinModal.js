import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import TransactionPin from '../auth/TransactionPin';
import BaseModal from '../common/modal/BaseModal';
import { useTranslation } from 'react-i18next';
const VerifyPinModal = ({ isOpen, toggle, onSubmit, error }) => {
  const { t } = useTranslation();
  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('wallet.verifyPin')}
      className="verify-pin-modal"
    >
      <TransactionPin
        title={t('wallet.verifyWalletPinSubtitle')}
        onSubmit={onSubmit}
      />
      {error && (
        <Alert color="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </BaseModal>
  );
};

VerifyPinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default VerifyPinModal;
