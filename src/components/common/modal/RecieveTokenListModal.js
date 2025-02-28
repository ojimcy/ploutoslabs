// File Path: src/components/ReceiveTokenListModal.js

import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ListGroup, ListGroupItem, Row, Col, Input, Button } from 'reactstrap';
import { AppContext } from '../../../context/AppContext';
import BaseModal from '../modal/BaseModal';
import './tokenList.css';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useCurrentUser } from '../../../hooks/telegram';
import pltlLogo from '../../../assets/images/logo.png';
import { useTranslation } from 'react-i18next';
function ReceiveTokenListModal({ isOpen, toggle, tokens }) {
  const navigate = useNavigate();
  const { selectToken, selectedWallet } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = useCurrentUser();
  const { t } = useTranslation();

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenClick = (token) => {
    selectToken(token);
    navigate('/dashboard/receive');
    toggle();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(
      selectedWallet?.address || currentUser.smartWalletAddress
    );
    toast.success(t('modal.addressCopiedToClipboard'));
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const footerContent = (
    <Button color="primary" className="close-button" onClick={toggle}>
      {t('modal.close')}
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.selectToken')}
      className="receive token-modal"
      footerContent={footerContent}
    >
      <Row className="mb-3">
        <Col>
          <Input
            type="text"
            placeholder={t('modal.searchToken')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ color: 'white' }}
          />
        </Col>
      </Row>
      <ListGroup>
        {filteredTokens.map((token, index) => (
          <React.Fragment key={index}>
            <ListGroupItem className="token-item">
              <div className="d-flex" onClick={() => handleTokenClick(token)}>
                <img
                  src={token.logo === '' ? pltlLogo : token.logo}
                  alt={token.name}
                  width={35}
                  height={40}
                  className="token-icon"
                />
                <div className="token-info">
                  <div className="token-name">{token.name}</div>
                  <div className="token-address">
                    {currentUser && formatAddress(selectedWallet?.address)}
                  </div>
                </div>
              </div>

              <div className="token-actions">
                <button className="token-action-btn" onClick={copyAddress}>
                  <FaCopy size={22} />
                </button>
              </div>
            </ListGroupItem>
            <hr />
          </React.Fragment>
        ))}
      </ListGroup>
    </BaseModal>
  );
}

ReceiveTokenListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      logo: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ReceiveTokenListModal;
