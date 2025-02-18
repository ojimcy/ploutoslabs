import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'reactstrap';
import BaseModal from '../common/modal/BaseModal';
import './deleteWalletModal.css';

const DeleteWalletModal = ({ isOpen, toggle, onDelete, loading }) => {
  const footerContent = (
    <>
      <Button color="danger" onClick={onDelete} disabled={loading}>
        {loading ? <Spinner size="sm" /> : 'Delete'}
      </Button>
      <Button color="secondary" onClick={toggle}>
        Cancel
      </Button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title="Delete Wallet"
      className="delete-wallet-modal"
      footerContent={footerContent}
    >
      <div className="delete-warning">
        Are you sure you want to delete this wallet? This action cannot be
        undone.
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
