// File Path: src/components/ReceiveTokenListModal.js

import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col,
  Input,
} from 'reactstrap';
import { AppContext } from '../../../context/AppContext';
import './tokenList.css';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ReceiveTokenListModal({ isOpen, toggle, tokens }) {
  const navigate = useNavigate();
  const { selectToken } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenClick = (token) => {
    selectToken(token);
    navigate('/dashboard/receive');
    toggle();
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="receive token-modal"
      fade={false}
    >
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
                    src={token.icon}
                    alt={token.name} width={35} height={45}
                    className="token-icon"
                  />
                  <div className="token-info">
                    <div className="token-name">{token.name}</div>
                    <div className="token-address">
                      {formatAddress(token.address)}
                    </div>
                  </div>
                </div>

                <div className="token-actions">
                  <button
                    className="token-action-btn"
                    onClick={() => copyAddress(token.address)}
                  >
                    <FaCopy size={22} />
                  </button>
                </div>
              </ListGroupItem>
              <hr />
            </React.Fragment>
          ))}
        </ListGroup>
      </ModalBody>
      <Button className="close-button" onClick={toggle}>
        Close
      </Button>
    </Modal>
  );
}

ReceiveTokenListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ReceiveTokenListModal;
