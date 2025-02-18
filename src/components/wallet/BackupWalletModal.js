import React, { useState, useEffect } from 'react';
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
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      toggle();
    }, 300); // Match animation duration
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryPhrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Clean up animation state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      className={`bottom-sheet-modal ${isClosing ? 'hide' : 'show'}`}
    >
      <ModalHeader toggle={handleClose}>Backup Wallet</ModalHeader>
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
        </div>
        <button
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? <FaCheck /> : <FaCopy />}
          <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
        </button>
        {copied && (
          <Alert color="success" className="copy-alert">
            Recovery phrase copied to clipboard!
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleClose}>
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
