import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { Separator } from '../common/Seperator';
import { formatAddress } from '../../lib/utils';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const TransactionCard = ({ transaction }) => {
  const isSend = transaction.type === 'send';

  return (
    <>
      <Col xs="12" className="crypto-card">
        <div className="crypto-card-content mt-2">
          <div className="crypto-icon">
            <div className="icons">
              {isSend ? <FaArrowUp size={30} /> : <FaArrowDown size={30} />}
            </div>
            <div className="crypto-info d-flex flex-column align-items-baseline">
              <div className="crypto-symbol">
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </div>
              <div className="crypto-price">
                {`${isSend ? 'To' : 'From'}: 
                ${formatAddress(transaction.address)}`}
              </div>
            </div>
          </div>
          <div className="crypto-amount">
            <div
              className="crypto-quantity"
              style={{ color: isSend ? 'red' : 'green' }}
            >
              {`${isSend ? '-' : '+'}${transaction.amount} ${
                transaction.symbol
              }`}
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
    symbol: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
  }).isRequired,
};

export default TransactionCard;
