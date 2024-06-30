// File Path: src/components/TransactionCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { Separator } from '../common/Seperator';
import { formatAddress } from '../../lib/utils';

const TransactionCard = ({ transaction }) => {
  return (
    <>
      <Col xs="12" className="crypto-card">
        <div className="crypto-card-content mt-2">
          <div className="crypto-icon">
            <img
              src={transaction.icon}
              alt={transaction.symbol}
              width={45}
              height={45}
            />
            <div className="crypto-info d-flex flex-column align-items-baseline">
              <div className="crypto-symbol">{transaction.type}</div>
              <div className="crypto-price">
                {`${transaction.type === 'send' ? 'To' : 'From'}: 
                ${formatAddress(transaction.address)}`}
              </div>
            </div>
          </div>
          <div className="crypto-amount">
            <div className="crypto-quantity">
              {`${transaction.type === 'send' ? '-' : '+'}${
                transaction.amount
              } ${transaction.symbol}`}
            </div>
          </div>
        </div>
      </Col>
      <Separator />
    </>
  );
};

TransactionCard.propTypes = {
  transaction: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
  }).isRequired,
};

export default TransactionCard;
