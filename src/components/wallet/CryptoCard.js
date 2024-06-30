import React from 'react';
import PropTypes from 'prop-types';
import { Separator } from '../common/Seperator';

const CryptoCard = ({ token, onTokenClick }) => {
  return (
    <>
      <div className="crypto-card" onClick={() => onTokenClick(token)}>
        <div className="crypto-card-content mt-2">
          <div className="crypto-icon">
            <img src={token.icon} alt={token.symbol} width={45} height={45} />
            <div className="crypto-info">
              <div className="crypto-symbol">{token.symbol}</div>
              <div className="crypto-price">{token.price}</div>
            </div>
          </div>
          <div className="crypto-amount">
            <div className="crypto-quantity">{token.quantity}</div>
            <div className="crypto-value">
              ${(token.quantity * token.price).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};

CryptoCard.propTypes = {
  token: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onTokenClick: PropTypes.func.isRequired,
};

export default CryptoCard;
