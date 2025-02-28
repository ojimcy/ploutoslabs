import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'reactstrap';
import BaseModal from '../common/modal/BaseModal';
import './deleteWalletModal.css';
import { useTranslation } from 'react-i18next';

const DeleteWalletModal = ({ isOpen, toggle, onDelete, loading }) => {
  const { t } = useTranslation();
  const footerContent = (
    <>
      <Button color="danger" onClick={onDelete} disabled={loading}>
        {loading ? <Spinner size="sm" /> : t('common.delete')}
      </Button>
      <Button color="secondary" onClick={toggle}>
        {t('common.cancel')}
      </Button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.deleteWallet')}
      className="delete-wallet-modal"
      footerContent={footerContent}
    >
      <div className="delete-warning">
        {t('modal.deleteWalletWarning')}
      </div>
    </BaseModal>
  );
};

DeleteWalletModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default DeleteWalletModal;
