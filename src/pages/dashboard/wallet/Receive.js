import React, { useContext } from 'react';
import { Container, Button } from 'reactstrap';
import QRCode from 'qrcode.react';
import './receive.css';
import { AppContext } from '../../../context/AppContext';
import { toast } from 'react-toastify';

const Receive = () => {
  const { selectedToken } = useContext(AppContext);

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedToken?.walletAddress);
    toast.success('Address copied to clipboard!');
  };

  if (!selectedToken) {
    return <div>No token selected</div>;
  }

  return (
    <Container className="receive-container d-flex flex-column justify-content-center align-items-center">
      <h3 className="receive-header">Receive</h3>
      <hr />
      <div className="address-code">
        <QRCode
          value={selectedToken.walletAddress}
          size={180}
          className="qrcode"
        />
        <div className="qr-info">
          <p>Your {selectedToken.name} address</p>
        </div>
        <p className="wallet-address">{selectedToken.walletAddress}</p>
      </div>

      <Button color="warning" className="copy-button" onClick={copyAddress}>
        Copy address
      </Button>
    </Container>
  );
};

export default Receive;
