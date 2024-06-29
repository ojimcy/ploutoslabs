import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from 'reactstrap';
import { AppContext } from '../../../context/AppContext';
import './tokenList.css';

function TokenListModal({ isOpen, toggle, tokens }) {
  const navigate = useNavigate();
  const { selectToken } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenClick = (token) => {
    selectToken(token);
    console.log('clicked');
    navigate('/dashboard/send');
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="token-modal" fade={false}>
      <ModalHeader toggle={toggle}>Select Token</ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col>
            <Input
              type="text"
              placeholder="Search token"
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
                <img src={token.icon} alt={token.name} className="token-icon" />
                <div className="token-info">
                  <div className="token-name">{token.name}</div>
                  <div className="token-amount">{token.quantity}</div>
                </div>
              </ListGroupItem>
              <hr />
            </React.Fragment>
          ))}
        </ListGroup>
      </ModalBody>
    </Modal>
  );
}

TokenListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TokenListModal;
