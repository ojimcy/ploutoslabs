// File Path: src/components/common/modal/ConfirmSendModal.js

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import './confirmSendModal.css';
import { getTransactionDetails } from '../../../lib/server';
import { WebappContext } from '../../../context/telegram';

function ConfirmSendModal({ isOpen, toggle, transaction, result, error }) {
  const { webapp } = useContext(WebappContext);
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState(result);
  const [transactionError, setTransactionError] = useState(error);

  useEffect(() => {
    if (result) {
      setLoading(true);
      webapp.openTelegramLink(`https://keys.ploutoslabs.io/sign?txid=${result.id}`);
      pollTransactionDetails(result.id);
    }
  }, [result]);

  const pollTransactionDetails = async (txid) => {
    const pollInterval = 5000; // 5 seconds
    const poll = setInterval(async () => {
      try {
        const response = await getTransactionDetails(txid);
        if (response.data.status === 'confirmed') {
          clearInterval(poll);
          setTransactionResult(response.data);
          setLoading(false);
        }
      } catch (err) {
        setTransactionError(err.message);
        clearInterval(poll);
        setLoading(false);
      }
    }, pollInterval);
  };

  if (!transaction) return null;

  const { recipient, amount, token } = transaction;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="confirm-send-modal"
      fade={false}
    >
      <ModalHeader toggle={toggle} className="modal-header">
        Confirm Send
      </ModalHeader>
      <ModalBody className="modal-body">
        {transactionError ? (
          <div className="error-message">
            <p>Transaction failed:</p>
            <p>{transactionError}</p>
          </div>
        ) : transactionResult ? (
          <div className="success-message">
            <p>Transaction successful!</p>
            <p>Transaction ID: {transactionResult.txid}</p>
          </div>
        ) : loading ? (
          <div className="loading-message">
            <Spinner />
            <p>Waiting for transaction confirmation...</p>
          </div>
        ) : (
          <>
            <div className="confirm-header d-flex flex-column justify-content-center align-items-center">
              <img src={token.icon} alt={token.name} className="token-icon" />
              <h3 className="amount">
                {amount} {token.name}
              </h3>
            </div>
            <div className="confirm-details">
              <Row>
                <Col>
                  <div className="detail-item">
                    <span className="label">To</span>
                    <span className="value">{recipient}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="detail-item">
                    <span className="label">Network</span>
                    <span className="value">{token.network}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="detail-item">
                    <span className="label">Network fee</span>
                    <span className="value">${token.networkFee}</span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="confirm-actions d-flex justify-content-between">
              <Button
                color="secondary"
                onClick={toggle}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="send-button"
                onClick={() => setLoading(true)}
              >
                {loading ? <Spinner size="sm" /> : 'Send'}
              </Button>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}

ConfirmSendModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    recipient: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    token: PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      network: PropTypes.string.isRequired,
      networkFee: PropTypes.string,
    }).isRequired,
  }),
  result: PropTypes.object,
  error: PropTypes.string,
};

export default ConfirmSendModal;
