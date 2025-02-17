import React, { useContext, useState } from 'react';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Alert,
} from 'reactstrap';
import { FaEdit, FaKey, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatAddress } from '../../../lib/utils';
import './wallet-detail.css';
import { AppContext } from '../../../context/AppContext';
import TransactionPin from '../../../components/auth/TransactionPin';
import { decryptWalletData } from '../../../lib/utils';
import BackupWalletModal from '../../../components/wallet/BackupWalletModal';

const WalletDetail = () => {
  const navigate = useNavigate();
  const { walletToManage } = useContext(AppContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [pinError, setPinError] = useState('');

  if (!walletToManage) {
    navigate('/dashboard/accounts');
    return null;
  }

  const handleBack = () => {
    navigate('/dashboard/accounts');
  };

  const handleEditSave = async () => {};

  const handleDelete = async () => {};

  const handleShowBackup = async (pin) => {
    try {
      // Decrypt wallet data including mnemonic
      const decryptedData = await decryptWalletData(walletToManage, pin);
      if (!decryptedData.mnemonic) {
        throw new Error('No recovery phrase found for this wallet');
      }
      console.log('decryptedData', decryptedData);
      setRecoveryPhrase(decryptedData.mnemonic);
      setShowBackupModal(true);
      setPinError('');
      setShowPinModal(false);
    } catch (err) {
      setPinError(err.message || 'Invalid PIN or corrupted wallet data');
    }
  };

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
              onClick={() => setShowPinModal(true)}
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

        {/* Replace the old backup modal with: */}
        <BackupWalletModal
          isOpen={showBackupModal}
          toggle={() => setShowBackupModal(false)}
          recoveryPhrase={recoveryPhrase}
        />

        {/* Keep the PIN modal */}
        <Modal isOpen={showPinModal} toggle={() => setShowPinModal(false)}>
          <ModalHeader toggle={() => setShowPinModal(false)}>
            Verify PIN
          </ModalHeader>
          <ModalBody>
            <TransactionPin
              title="Enter your wallet PIN to view recovery phrase"
              onSubmit={handleShowBackup}
            />
            {pinError && (
              <Alert color="danger" className="mt-3">
                {pinError}
              </Alert>
            )}
          </ModalBody>
        </Modal>
      </Container>
    </div>
  );
};

export default WalletDetail;
