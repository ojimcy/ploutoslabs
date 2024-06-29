import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Button, Row, Col } from 'reactstrap';
import './confirmSendModal.css';

function ConfirmSendModal({ isOpen, toggle, transaction }) {
  if (!transaction) return null;

  const { recipient, amount, token, networkFee } = transaction;

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
                <span className="value">${networkFee}</span>
              </div>
            </Col>
          </Row>
        </div>
        <div className="confirm-actions d-flex justify-content-between">
          <Button color="secondary" onClick={toggle} className="cancel-button">
            Cancel
          </Button>
          <Button color="primary" className="send-button">
            Send
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

ConfirmSendModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    recipient: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    token: PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      network: PropTypes.string.isRequired,
    }).isRequired,
    networkFee: PropTypes.string.isRequired,
  }),
};

export default ConfirmSendModal;
