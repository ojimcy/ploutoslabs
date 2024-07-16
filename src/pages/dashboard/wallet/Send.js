import React, { useContext, useState } from 'react';
import { Container, Input, Button, Form, FormGroup, Label } from 'reactstrap';
import { AppContext } from '../../../context/AppContext';
import './send.css';
import ConfirmSendModal from '../../../components/common/modal/ConfirmSendModal';
import { initTransaction } from '../../../lib/server';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

import pltlLogo from '../../../assets/images/logo.png';

const Send = () => {
  const { selectedToken, selectedWallet } = useContext(AppContext);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [error, setError] = useState(null);

  if (!selectedToken) {
    return <div>No token selected</div>;
  }

  const handleMaxClick = () => {
    setAmount(selectedToken.balance);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSendClick = async () => {
    try {
      const transactionData = {
        walletAddress: selectedWallet,
        toAddress: recipient,
        amount,
        token: selectedToken.address,
        tokenDecimals: selectedToken.decimals,
      };
      const result = await initTransaction(transactionData);
      setTransactionResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      toggleModal();
    }
  };

  return (
    <Container className="send-container">
      <TelegramBackButton />
      <div className="send-header d-flex flex-column justify-content-center align-items-center">
        <h3>Send {selectedToken.name}</h3>
        <img
          src={selectedToken.logo === '' ? pltlLogo : selectedToken.logo}
          alt={selectedToken.name}
          className="token-icon"
        />
      </div>
      <Form className="send-form mt-5">
        <FormGroup>
          <Label for="recipient">Recipient</Label>
          <Input
            type="text"
            name="recipient"
            id="recipient"
            placeholder={`Enter recipient's ${selectedToken.name} address`}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="mt-3">
          <Label for="amount">Amount</Label>
          <Input
            type="text"
            name="amount"
            id="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="max-value mt-1" onClick={handleMaxClick}>
            Max: {selectedToken.balance}
          </span>
        </FormGroup>
        <Button
          color="primary"
          className="send-button mt-4"
          onClick={handleSendClick}
          disabled={!amount || !recipient}
        >
          Send
        </Button>
      </Form>

      <ConfirmSendModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        transaction={{
          recipient,
          amount,
          token: selectedToken,
          networkFee: '0.0021',
        }}
        result={transactionResult}
        error={error}
      />
    </Container>
  );
};

export default Send;
