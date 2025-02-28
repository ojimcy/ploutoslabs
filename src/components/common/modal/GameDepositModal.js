import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import BaseModal from '../modal/BaseModal';
import { getDepositAddress } from '../../../lib/server';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
function GameDepositModal({ isOpen, toggle }) {
  const { t } = useTranslation();
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
    toast.success(t('modal.depositAddressCopied'));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.createGame')}
      className="main-modal"
    >
      <div className="game-deposit">
        <p>{t('modal.sendETHBaseNetwork')}</p>
        <div className="deposit-address">
          <code>{depositAddress}</code>
        </div>

        <Button color="primary" onClick={copyToClipboard}>
          {t('common.copy')}
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
