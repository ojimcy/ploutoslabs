// File Path: src/components/common/modal/ConfirmSendModal.js

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, Spinner } from 'reactstrap';
import './confirmSendModal.css';
import { getTransactionDetails } from '../../../lib/server';
import { decryptPrivateKey, formatAddress } from '../../../lib/utils';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { base } from 'viem/chains';
import TransactionPin from '../../auth/TransactionPin';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BaseModal from '../modal/BaseModal';
import { useTranslation } from 'react-i18next';
function ConfirmSendModal({ isOpen, toggle, transaction, result, error }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedToken, selectedWallet } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [transactionError, setTransactionError] = useState(error);

  useEffect(() => {
    if (result) {
      setLoading(true);
      navigate(` https://keys.ploutoslabs.io/sign?txid=${result.id}`);
      pollTransactionDetails(result.id);
    }
  }, [result]);

  const validatePin = async (pin) => {
    if (!selectedToken) return;

    setShowPinPad(false);
    setLoading(true);

    try {
      let decryptedPrivateKey;
      try {
        decryptedPrivateKey = await decryptPrivateKey(
          selectedWallet.privateKey,
          pin,
          selectedWallet.iv,
          selectedWallet.tag
        );
      } catch (error) {
        console.log(error);
        toast.error(t('modal.invalidPassword'));
        return;
      }

      const account = privateKeyToAccount(`0x${decryptedPrivateKey}`);

      const walletClient = createWalletClient({
        chain: base,
        transport: http(
          'https://site1.moralis-nodes.com/base/7c74003aee444699a46ee88fef4a796f'
        ),
      });

      const hash = await walletClient.sendTransaction({
        account,
        to: recipient,
        value: parseFloat(amount) * 10 ** 18,
      });

      setTransactionResult({ hash });
    } catch (err) {
      console.log(err);
      toast.error(t('modal.errorTryAgain'));
    }
  };

  const pollTransactionDetails = async (txid) => {
    const pollInterval = 5000; // 5 seconds
    const poll = setInterval(async () => {
      try {
        const response = await getTransactionDetails(txid);
        console.log(response);
        if (response.status === 'confirmed') {
          clearInterval(poll);
          setTransactionResult(response);
          setLoading(false);
          window.history.back();
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

  const footerContent = (
    <>
      <Button color="secondary" className="cancel-button" onClick={toggle}>
        {t('common.cancel')}
      </Button>
      <Button
        color="primary"
        className="send-button"
        onClick={() => setShowPinPad(true)}
      >
        {loading ? <Spinner size="sm" /> : t('common.send')}
      </Button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title="Confirm Transaction"
      className="confirm-send-modal"
      position="bottom"
      footerContent={footerContent}
    >
      {showPinPad && (
        <TransactionPin
          title={'Enter your 6 digit pin'}
          onSubmit={validatePin}
        />
      )}

      {!showPinPad && (
        <>
          {transactionError ? (
            <div className="error-message">
              <p>{t('modal.transactionFailed')}:</p>
              <p>{transactionError}</p>
            </div>
          ) : transactionResult ? (
            <div className="success-message">
              <p>{t('modal.transactionSubmitted')}</p>
              <p>
                <a href={`https://basescan.org/tx/${transactionResult.hash}`}>
                  {t('modal.trackTransaction')}
                </a>
              </p>
            </div>
          ) : loading ? (
            <div className="loading-message">
              <Spinner />
              <p>{t('modal.waitingForTransactionConfirmation')}</p>
            </div>
          ) : (
            <>
              <div className="confirm-header d-flex flex-column justify-content-center align-items-center">
                <img src={token.logo} alt={token.name} className="token-icon" />
                <h3 className="amount">
                  {amount} {token.name}
                </h3>
              </div>
              <div className="confirm-details">
                <Row>
                  <Col>
                    <div className="detail-item">
                      <span className="label">{t('common.to')}</span>
                      <span className="value">{formatAddress(recipient)}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="detail-item">
                      <span className="label">{t('common.network')}</span>
                      <span className="value">{token.network}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="detail-item">
                      <span className="label">{t('common.networkFee')}</span>
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
                  {t('common.cancel')}
                </Button>
                <Button
                  color="primary"
                  className="send-button"
                  onClick={() => setShowPinPad(true)}
                >
                  {loading ? <Spinner size="sm" /> : t('common.send')}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </BaseModal>
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
      logo: PropTypes.string.isRequired,
      network: PropTypes.string.isRequired,
      networkFee: PropTypes.string,
    }).isRequired,
  }),
  result: PropTypes.object,
  error: PropTypes.string,
};

export default ConfirmSendModal;
