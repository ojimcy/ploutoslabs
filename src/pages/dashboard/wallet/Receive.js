import React, { useContext, useEffect } from 'react';
import { Container, Button } from 'reactstrap';
import QRCode from 'qrcode.react';
import './receive.css';
import { AppContext } from '../../../context/AppContext';
import { toast } from 'react-toastify';
import { getUserByTelegramID } from '../../../lib/server';

const Receive = () => {
  const {setSelectedWallet, selectedWallet} = useContext(AppContext);
  const telegramId = localStorage.getItem('TELEGRAM_ID');

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
    toast.success('Address copied to clipboard!');
  };

  if (!selectedWallet) {
    return <div>No token selected</div>;
  }

  return (
    <Container className="receive-container d-flex flex-column justify-content-center align-items-center">
      <h3 className="receive-header">Receive</h3>
      <hr />
      <div className="address-code">
        <QRCode
          value={selectedWallet.address}
          size={180}
          className="qrcode"
        />
        <div className="qr-info">
          <p>Your {selectedWallet.name} address</p>
        </div>
        <p className="wallet-address">{selectedWallet.address}</p>
      </div>

      <Button color="warning" className="copy-button" onClick={copyAddress}>
        Copy address
      </Button>
    </Container>
  );
};

export default Receive;
