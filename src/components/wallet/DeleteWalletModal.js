import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from 'reactstrap';
import './deleteWalletModal.css';

const DeleteWalletModal = ({ isOpen, toggle, onDelete, loading }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="delete-wallet-modal">
      <ModalHeader toggle={toggle}>Delete Wallet</ModalHeader>
      <ModalBody>
        <div className="delete-warning">
          Are you sure you want to delete this wallet? This action cannot be
          undone.
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onDelete} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Delete'}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

DeleteWalletModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default DeleteWalletModal;
