import React, { useContext, useEffect } from 'react';
import { Container, Button } from 'reactstrap';
import QRCode from 'qrcode.react';
import './receive.css';
import { AppContext } from '../../../context/AppContext';
import { toast } from 'react-hot-toast';
import { getUserByTelegramID } from '../../../lib/server';
import { useTranslation } from 'react-i18next';

const Receive = () => {
  const { setSelectedWallet, selectedWallet } = useContext(AppContext);
  const telegramId = localStorage.getItem('TELEGRAM_ID');
  const { t } = useTranslation();

  useEffect(() => {
    if (!telegramId) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramId);
      if (user.smartWalletAddress) {
        setSelectedWallet({
          id: 1,
          name: 'Smart Wallet',
          address: user.smartWalletAddress,
          balance: user.balance,
        });
      }
    };

    fn();
  }, [telegramId]);

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedWallet?.address);
    toast.success(t('modal.addressCopiedToClipboard'));
  };

  if (!selectedWallet) {
    return <div>{t('wallet.noTokenSelected')}</div>;
  }

  return (
    <Container className="receive-container d-flex flex-column justify-content-center align-items-center">
      <h3 className="receive-header">{t('wallet.receive')}</h3>
      <hr />
      <div className="address-code">
        <QRCode value={selectedWallet.address} size={180} className="qrcode" />
        <div className="qr-info">
          <p>{t('wallet.yourWalletAddress', { wallet: selectedWallet.name })}</p>
        </div>
        <p className="wallet-address">{selectedWallet.address}</p>
      </div>

      <Button color="warning" className="copy-button" onClick={copyAddress}>
        {t('modal.copyAddress')}
      </Button>
    </Container>
  );
};

export default Receive;
