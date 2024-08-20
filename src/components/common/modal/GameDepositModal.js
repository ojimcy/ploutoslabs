import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import './modal.css';
import { getDepositAddress } from '../../../lib/server';

function GameDepositModal({ isOpen, toggle }) {
  const [depositAddress, setDepositAddress] = useState('');

  useEffect(() => {
    const fetchDepositAddress = async () => {
      const res = await getDepositAddress();
      setDepositAddress(res.address);
    };

    fetchDepositAddress();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress);
    alert('Deposit address copied to clipboard!');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Create Game</ModalHeader>
      <ModalBody>
        <div className="game-deposit">
          <p>Send USDT (base network) to te following address:</p>
          <div className="deposit-address">
            <code>{depositAddress}</code>
          </div>

          <Button color="primary" onClick={copyToClipboard}>
            Copy Address
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

GameDepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default GameDepositModal;
