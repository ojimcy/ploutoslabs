import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { Separator } from '../common/Seperator';
import { formatAddress } from '../../lib/utils';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getWalletHIstory } from '../../lib/server';
import { AppContext } from '../../context/AppContext';
import { useWebApp } from '../../hooks/telegram';

const TransactionCard = () => {
  const webApp = useWebApp();
  const [transactions, setTransactions] = useState([]);
  const { selectedWallet } = useContext(AppContext);

  useEffect(() => {
    if (!selectedWallet) return;
    const fn = async () => {
      const response = await getWalletHIstory(selectedWallet.address);
      setTransactions(response);
    };

    fn();
  }, [selectedWallet]);

  const isSend = transactions.amount < 0 === 'send';

  const handleTransactionClick = async (trx) => {
    webApp.openLink(`https://basescan.org/tx/${trx.transactionHash}`);
  };

  return (
    <>
      {transactions.length === 0 ? (
        <div className="not-found">
          <p>No record found!!!</p>
        </div>
      ) : (
        transactions.map((trx, index) => (
          <React.Fragment key={index}>
            <Col
              xs="12"
              className="crypto-card"
              onClick={() => handleTransactionClick(trx)}
            >
              <div className="crypto-card-content mt-2">
                <div className="crypto-icon">
                  <div className="icons">
                    {isSend ? (
                      <FaArrowUp size={30} />
                    ) : (
                      <FaArrowDown size={30} />
                    )}
                  </div>
                  <div className="crypto-info d-flex flex-column align-items-baseline">
                    <div className="crypto-symbol">
                      {trx.action.charAt(0).toUpperCase() + trx.action.slice(1)}
                    </div>
                    <div className="crypto-price">
                      {`${isSend ? 'To' : 'From'}: 
                ${formatAddress(trx.walletAddress)}`}
                    </div>
                  </div>
                </div>
                <div className="crypto-amount">
                  <div
                    className="crypto-quantity"
                    style={{ color: isSend ? 'red' : 'green' }}
                  >
                    {`${isSend ? '-' : '+'}${trx.amount} ${trx.tokenSymbol}`}
                  </div>
                </div>
              </div>
            </Col>
            <Separator />
          </React.Fragment>
        ))
      )}
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
