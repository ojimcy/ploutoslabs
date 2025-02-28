import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Alert } from 'reactstrap';
import { FaCopy, FaCheck } from 'react-icons/fa';
import BaseModal from '../common/modal/BaseModal';
import './backupWalletModal.css';
import { useTranslation } from 'react-i18next';

const BackupWalletModal = ({ isOpen, toggle, recoveryPhrase }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryPhrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const footerContent = (
    <Button color="primary" onClick={toggle}>
      {t('common.done')}
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.backupWallet')}
      className="backup-wallet-modal"
      position="bottom"
      footerContent={footerContent}
    >
      <div className="backup-warning">
        {t('modal.backupWarning')}
      </div>
      <div className="recovery-container">
        <div className="recovery-phrase">
          {recoveryPhrase.split(' ').map((word, index) => (
            <div key={index} className="phrase-word">
              <span className="word-number">{index + 1}.</span>
              <span className="word-text">{word}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`copy-button ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? <FaCheck /> : <FaCopy />}
        <span>{copied ? t('modal.copied') : t('modal.copyToClipboard')}</span>
      </button>
      {copied && (
        <Alert color="success" className="copy-alert">
          {t('modal.recoveryPhraseCopied')}
        </Alert>
      )}
    </BaseModal>
  );
};

BackupWalletModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  recoveryPhrase: PropTypes.string.isRequired,
};

export default BackupWalletModal;
