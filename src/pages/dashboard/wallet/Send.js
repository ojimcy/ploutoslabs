import React, { useContext, useState } from 'react';
import { decryptPrivateKey, formatAddress } from '../../../lib/utils';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http, parseEther } from 'viem';
import { base } from 'viem/chains';
import {
  Container,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Row,
  Col,
} from 'reactstrap';
import { AppContext } from '../../../context/AppContext';
import './send.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import pltlLogo from '../../../assets/images/logo.png';
import TransactionPin from '../../../components/auth/TransactionPin';

const Send = () => {
  const { selectedToken, selectedWallet } = useContext(AppContext);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  if (!selectedToken) {
    return <div>No token selected</div>;
  }

  const handleMaxClick = () => {
    setAmount(selectedToken.balance_formatted);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSendClick = async () => {
    setTransactionResult(null);
    toggleModal();
  };

  const validatePin = async (pin) => {
    if (!selectedToken) return;

    setShowPinPad(false);
    setLoading(true);
    toggleModal();

    let decryptedPrivateKey;
    try {
      decryptedPrivateKey = decryptPrivateKey(
        selectedWallet.privateKey,
        pin,
        selectedWallet.iv,
        selectedWallet.tag
      );
    } catch (error) {
      console.log(error);
      alert('Invalid passord');
      return;
    }

    try {
      const account = privateKeyToAccount(`0x${decryptedPrivateKey}`);
      console.log(account.address);

      const walletClient = createWalletClient({
        chain: base,
        transport: http(
          'https://site1.moralis-nodes.com/base/7c74003aee444699a46ee88fef4a796f'
        ),
      });

      const hash = await walletClient.sendTransaction({
        account,
        to: recipient,
        value: parseEther(amount),
      });

      setTransactionResult({ hash });
    } catch (err) {
      console.log(err);
      setTransactionError('Error. Please try again later');
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

      {!showPinPad && (
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
              Max: {selectedToken.balance_formatted}
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
      )}

      {showPinPad && (
        <TransactionPin
          title={'Enter your 6 digit pin'}
          onSubmit={validatePin}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        toggle={toggleModal}
        className="confirm-send-modal"
        fade={false}
      >
        <ModalHeader toggle={toggleModal} className="modal-header">
          Confirm Send
        </ModalHeader>
        <ModalBody className="modal-body">
          <>
            {transactionError ? (
              <div className="error-message">
                <p>Transaction failed:</p>
                <p>{transactionError}</p>
              </div>
            ) : transactionResult ? (
              <div className="success-message">
                <p>Transaction submitted successfully!</p>
                <p>
                  <a target='_blank' rel='noreferrer' href={`https://basescan.org/tx/${transactionResult.hash}`}>
                    Track Transaction
                  </a>
                </p>
              </div>
            ) : loading ? (
              <div className="loading-message">
                <Spinner />
                <p>Waiting for transaction confirmation...</p>
              </div>
            ) : (
              <>
                <div className="confirm-header d-flex flex-column justify-content-center align-items-center">
                  <img
                    src={selectedToken.logo}
                    alt={selectedToken.name}
                    className="token-icon"
                  />
                  <h3 className="amount">
                    {amount} {selectedToken.name}
                  </h3>
                </div>
                <div className="confirm-details">
                  <Row>
                    <Col>
                      <div className="detail-item">
                        <span className="label">To</span>
                        <span className="value">
                          {formatAddress(recipient)}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="detail-item">
                        <span className="label">Network</span>
                        <span className="value">{selectedToken.network}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="detail-item">
                        <span className="label">Network fee</span>
                        <span className="value">
                          ${selectedToken.networkFee}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="confirm-actions d-flex justify-content-between">
                  <Button
                    color="secondary"
                    onClick={toggleModal}
                    className="cancel-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    className="send-button"
                    onClick={() => {
                      setShowPinPad(true);
                      toggleModal();
                    }}
                  >
                    {loading ? <Spinner size="sm" /> : 'Send'}
                  </Button>
                </div>
              </>
            )}
          </>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default Send;
