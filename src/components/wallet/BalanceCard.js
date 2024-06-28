// File Path: src/components/BalanceCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import {
  FaArrowDown,
  FaArrowUp,
  FaDollarSign,
  FaGamepad,
  FaPlay,
  FaQrcode,
} from 'react-icons/fa';
import './wallet.css';

function BalanceCard(props) {
  const { netWorth } = props;

  const handleComingSoonClicked = () => {
    if (toast) {
      toast.info('This feature will be available soon');
    } else {
      console.error('Toast is not defined');
    }
  };

  return (
    <Container className="balance-card">
      <Row className="justify-content-center align-items-center text-center">
        <div className="mt-4">
          <h4 className="net-worth">Net Worth</h4>
          <h1 className="balance-amount">{netWorth || '~$0'}</h1>
        </div>
      </Row>
      <div className="wallet-actions">
        <div className="wallet-action" onClick={handleComingSoonClicked}>
          <FaArrowUp className="icon" />
          <div className="label">Send</div>
        </div>
        <div className="wallet-action" onClick={handleComingSoonClicked}>
          <FaArrowDown className="icon" />
          <div className="label">Receive</div>
        </div>
        <div className="wallet-action" onClick={handleComingSoonClicked}>
          <FaQrcode className="icon" />
          <div className="label">Swap</div>
        </div>
        <div className="wallet-action" onClick={handleComingSoonClicked}>
          <FaDollarSign className="icon" />
          <div className="label">Buy & Sell</div>
        </div>
        <div className="wallet-action" onClick={handleComingSoonClicked}>
          <FaPlay className="icon" />
          <div className="label">Launchpad</div>
        </div>
        <div className="wallet-action" onClick={handleComingSoonClicked}>
          <FaGamepad className="icon" />
          <div className="label">Games</div>
        </div>
      </div>
    </Container>
  );
}

BalanceCard.propTypes = {
  netWorth: PropTypes.string,
};

export default BalanceCard;
