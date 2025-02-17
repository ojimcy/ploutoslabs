import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
} from 'reactstrap';
import { FaCopy, FaCheck } from 'react-icons/fa';
import './backupWalletModal.css';

const BackupWalletModal = ({ isOpen, toggle, recoveryPhrase }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryPhrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Backup Wallet</ModalHeader>
      <ModalBody>
        <div className="backup-warning">
          Keep your recovery phrase in a safe place. Anyone with access to it
          can take control of your wallet.
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
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
        {copied && (
          <Alert color="success" className="copy-alert">
            Recovery phrase copied to clipboard!
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};

BackupWalletModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  recoveryPhrase: PropTypes.string.isRequired,
};

export default BackupWalletModal;
