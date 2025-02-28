import React, { useContext, useState } from 'react';
import {
  Container,
  Button,
  Input,
  Spinner,
} from 'reactstrap';
import { FaEdit, FaKey, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatAddress } from '../../../lib/utils';
import './wallet-detail.css';
import { AppContext } from '../../../context/AppContext';
import { decryptWalletData } from '../../../lib/utils';
import BackupWalletModal from '../../../components/wallet/BackupWalletModal';
import { toast } from 'react-hot-toast';
import DeleteWalletModal from '../../../components/wallet/DeleteWalletModal';
import { removeWallet, editWalletLabel } from '../../../lib/db';
import VerifyPinModal from '../../../components/wallet/VerifyPinModal';
import { useTranslation } from 'react-i18next';
const WalletDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { walletToManage } = useContext(AppContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [pinError, setPinError] = useState('');
  const [walletLabel, setWalletLabel] = useState(walletToManage?.label);
  const [loading, setLoading] = useState(false);

  if (!walletToManage) {
    navigate('/dashboard/accounts');
    return null;
  }

  const handleBack = () => {
    navigate('/dashboard/accounts');
  };

  const handleEditLabel = async () => {
    try {
      setLoading(true);
      editWalletLabel(walletToManage.address, walletLabel);
      toast.success(t('wallet.updatedSuccessfully'));
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to update wallet label:', err);
      toast.error(err.response?.data?.error || t('wallet.failedToUpdate'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // Remove wallet from local storage
      removeWallet(walletToManage.address);

      toast.success(t('wallet.deletedSuccessfully'));
      navigate('/dashboard/accounts');
    } catch (err) {
      console.error('Failed to delete wallet:', err);
      toast.error(t('wallet.failedToDelete'));
    } finally {
      setLoading(false);
    }
  };

  const handleShowBackup = async (pin) => {
    try {
      // Decrypt wallet data including mnemonic
      const decryptedData = await decryptWalletData(walletToManage, pin);
      if (!decryptedData.mnemonic) {
        throw new Error(t('wallet.noRecoveryPhraseFound'));
      }
      setRecoveryPhrase(decryptedData.mnemonic);
      setShowBackupModal(true);
      setPinError('');
      setShowPinModal(false);
    } catch (err) {
      setPinError(err.message || t('wallet.invalidPinOrCorruptedWalletData'));
    }
  };

  return (
    <div className="wallet-detail-page">
      <Container>
        <Button className="back-button mb-4" onClick={handleBack}>
          <FaArrowLeft /> {t('common.back')}
        </Button>

        <div className="wallet-detail-card">
          <div className="wallet-header">
            {isEditMode ? (
              <div className="edit-name-container">
                <Input
                  value={walletLabel}
                  placeholder={t('wallet.walletName')}
                  onChange={(e) => setWalletLabel(e.target.value)}
                />
                <div className="edit-actions">
                  <Button
                    color="primary"
                    onClick={handleEditLabel}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : t('common.save')}
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => setIsEditMode(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3>{walletLabel}</h3>
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
              <span>{t('wallet.backupWallet')}</span>
            </Button>
            <Button
              className="action-button delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrash />
              <span>{t('wallet.deleteWallet')}</span>
            </Button>
          </div>
        </div>

        <DeleteWalletModal
          isOpen={showDeleteModal}
          toggle={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
          loading={loading}
        />

        <BackupWalletModal
          isOpen={showBackupModal}
          toggle={() => setShowBackupModal(false)}
          recoveryPhrase={recoveryPhrase}
        />

        <VerifyPinModal
          isOpen={showPinModal}
          toggle={() => setShowPinModal(false)}
          onSubmit={handleShowBackup}
          error={pinError}
        />
      </Container>
    </div>
  );
};

export default WalletDetail;
