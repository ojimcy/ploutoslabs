import React from 'react';
import { Col, Row } from 'reactstrap';
import { Separator } from '../common/Seperator';
import { formatAddress } from '../../lib/utils';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const TransactionCard = ({ transactions }) => {
  const navigate = useNavigate();

  const isSend = transactions.amount < 0 === 'send';

  const handleTransactionClick = async (trx) => {
    navigate(`https://basescan.org/tx/${trx.transactionHash}`);
  };

  return (
    <>
      {transactions.length === 0 ? (
        <Row className="justify-content-center align-items-center text-center">
          <div className="mt-4">
            <h4>Transactions</h4>
            <p>No records found!!!</p>
          </div>
        </Row>
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
  transactions: PropTypes.array.isRequired,
};

export default TransactionCard;
