import React, { useContext, useState } from 'react';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap';
import { FaEdit, FaKey, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatAddress } from '../../../lib/utils';
import './wallet-detail.css';
import { AppContext } from '../../../context/AppContext';

const WalletDetail = () => {
  const navigate = useNavigate();
  const { walletToManage } = useContext(AppContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  if (!walletToManage) {
    navigate('/dashboard/accounts');
    return null;
  }

  const handleBack = () => {
    navigate('/dashboard/accounts');
  };

  const handleEditSave = async () => {};

  const handleDelete = async () => {};

  

  return (
    <div className="wallet-detail-page">
      <Container>
        <Button className="back-button mb-4" onClick={handleBack}>
          <FaArrowLeft /> Back
        </Button>

        <div className="wallet-detail-card">
          <div className="wallet-header">
            {isEditMode ? (
              <div className="edit-name-container">
                <Input value={walletToManage.label} placeholder="Wallet Name" />
                <div className="edit-actions">
                  <Button color="primary" onClick={handleEditSave}>
                    Save
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3>{walletToManage.label}</h3>
                <Button
                  className="edit-button"
                  onClick={() => setIsEditMode(true)}
                >
                  <FaEdit />
                </Button>
              </>
            )}
          </div>

          <div className="wallet-address">
            {formatAddress(walletToManage.address)}
          </div>

          <div className="wallet-action">
            <Button
              className="action-button backup-button"
              onClick={() => setShowBackupModal(true)}
            >
              <FaKey />
              <span> Backup Wallet</span>
            </Button>
            <Button
              className="action-button delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrash />
              <span> Delete Wallet</span>
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          toggle={() => setShowDeleteModal(false)}
        >
          <ModalHeader toggle={() => setShowDeleteModal(false)}>
            Delete Wallet
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete this wallet? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Backup Modal */}
        <Modal
          isOpen={showBackupModal}
          toggle={() => setShowBackupModal(false)}
        >
          <ModalHeader toggle={() => setShowBackupModal(false)}>
            Backup Wallet
          </ModalHeader>
          <ModalBody>
            <div className="backup-warning">
              Keep your recovery phrase in a safe place. Anyone with access to
              it can take control of your wallet.
            </div>
            <div className="recovery-phrase">{}</div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setShowBackupModal(false)}>
              Done
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default WalletDetail;
