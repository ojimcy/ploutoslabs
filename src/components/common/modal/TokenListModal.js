import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Input, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { AppContext } from '../../../context/AppContext';
import BaseModal from '../modal/BaseModal';
import './tokenList.css';
import pltlLogo from '../../../assets/images/logo.png';
import { useTranslation } from 'react-i18next';

function TokenListModal({ isOpen, toggle, tokens }) {
  const navigate = useNavigate();
  const { selectToken } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenClick = (token) => {
    selectToken(token);
    navigate('/dashboard/send');
    toggle();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      title={t('modal.selectToken')}
      className="token-modal"
    >
      <Row className="mb-3">
        <Col>
          <Input
            type="text"
            placeholder={t('modal.searchToken')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </Col>
      </Row>
      <ListGroup>
        {filteredTokens.map((token, index) => (
          <React.Fragment key={index}>
            <ListGroupItem
              className="token-item"
              onClick={() => handleTokenClick(token)}
            >
              <img
                src={token.logo === '' ? pltlLogo : token.logo}
                alt={token.name}
                width={35}
                height={40}
                className="token-icon"
              />
              <div className="token-info">
                <div className="token-name">{token.name}</div>
                <div className="token-amount">{token.balance_formatted}</div>
              </div>
            </ListGroupItem>
            <hr />
          </React.Fragment>
        ))}
      </ListGroup>
    </BaseModal>
  );
}

TokenListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      name: PropTypes.string,
      quantity: PropTypes.number,
    })
  ),
};

export default TokenListModal;
