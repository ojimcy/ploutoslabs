import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import BaseModal from '../modal/BaseModal';
import { getDepositAddress } from '../../../lib/server';
import { toast } from 'react-hot-toast';

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
    toast.success('Deposit address copied to clipboard!');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title="Create Game"
      className="main-modal"
    >
      <div className="game-deposit">
        <p>Send ETH (base network) to the following address:</p>
        <div className="deposit-address">
          <code>{depositAddress}</code>
        </div>

        <Button color="primary" onClick={copyToClipboard}>
          Copy Address
        </Button>
      </div>
    </BaseModal>
  );
}

GameDepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default GameDepositModal;
