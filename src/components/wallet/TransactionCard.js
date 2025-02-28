import React from 'react';
import { formatAddress } from '../../lib/utils';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './transaction-card.css';
import { useTranslation } from 'react-i18next';
const TransactionCard = ({ transactions }) => {
  const { t } = useTranslation();
  const handleTransactionClick = async (trx) => {
    window.open(`https://basescan.org/tx/${trx.transactionHash}`, '_blank');
  };

  return (
    <div className="transactions-wrapper">
      <div className="transactions-header">
        <h4>{t('common.recentTransactions')}</h4>
      </div>
      
      <div className="transactions-container">
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>{t('common.noTransactionsFound')}</p>
          </div>
        ) : (
          transactions.map((trx, index) => (
            <div 
              key={index}
              className="transaction-card" 
              onClick={() => handleTransactionClick(trx)}
            >
              <div className="transaction-icon">
                <div className={`icon-wrapper ${trx.amount < 0 ? 'send' : 'receive'}`}>
                  {trx.amount < 0 ? <FaArrowUp /> : <FaArrowDown />}
                </div>
              </div>

              <div className="transaction-details">
                <div className="transaction-main">
                  <div className="transaction-type">
                    {trx.amount < 0 ? t('common.sent') : t('common.received')}
                  </div>
                  <div className={`transaction-amount ${trx.amount < 0 ? 'send' : 'receive'}`}>
                    {`${trx.amount < 0 ? '-' : '+'}${Math.abs(trx.amount).toFixed(4)} ${trx.symbol}`}
                  </div>
                </div>
                <div className="transaction-info">
                  <div className="transaction-address">
                    {`${trx.amount < 0 ? t('common.to') : t('common.from')}: ${formatAddress(trx.to || trx.from)}`}
                  </div>
                  <div className="transaction-time">
                    {new Date(trx.timestamp * 1000).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className={`transaction-status ${trx.status?.toLowerCase() || 'completed'}`}>
                {trx.status?.toLowerCase() || 'completed'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

TransactionCard.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number,
      symbol: PropTypes.string,
      to: PropTypes.string,
      from: PropTypes.string,
      timestamp: PropTypes.number,
      status: PropTypes.string,
      transactionHash: PropTypes.string
    })
  ).isRequired,
};

export default TransactionCard;
