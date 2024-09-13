import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'reactstrap';
// import { toast } from 'react-toastify';
import {
  FaArrowDown,
  FaArrowUp,
  FaDollarSign,
  FaGamepad,
  FaPlay,
  FaQrcode,
} from 'react-icons/fa';
import TokenListModal from '../common/modal/TokenListModal';
import ReceiveTokenListModal from '../common/modal/RecieveTokenListModal';
import { AppContext } from '../../context/AppContext';
import { getTokenBalances } from '../../lib/server';

import './wallet.css';
import { Link, useNavigate } from 'react-router-dom';

function BalanceCard() {
  const navigate = useNavigate()
  const [sendModal, setSendModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);
  const { selectedWallet } = useContext(AppContext);
  const [tokens, setTokens] = useState([]);
  const [netWorth, setNetWorth] = useState(0);

  const toggleSendModal = () => setSendModal(!sendModal);
  const toggleReceiveModal = () => setReceiveModal(!receiveModal);

  // const handleComingSoonClicked = () => {
  //   if (toast) {
  //     toast.info('This feature will be available soon');
  //   } else {
  //     console.error('Toast is not defined');
  //   }
  // };

  const calculateNetWorth = (tokens) => {
    return tokens.reduce((acc, token) => {
      return acc + token.balance_formatted * token.usd_price;
    }, 0);
  };

  useEffect(() => {
    const tokenBalances = async () => {
      if (selectedWallet) {
        const response = await getTokenBalances(selectedWallet.address);
        setTokens(response);
        const netWorth = calculateNetWorth(response);
        setNetWorth(netWorth);
      }
    };

    tokenBalances();
  }, [selectedWallet]);

  return (
    <Container className="balance-card">
      <Row className="justify-content-center align-items-center text-center">
        <div className="mt-4">
          <h4 className="net-worth">Net Worth</h4>
          <h1 className="balance-amount">{netWorth.toFixed(2) || '~$0'}</h1>
        </div>
      </Row>
      <div className="wallet-actions">
        <div className="wallet-action" onClick={toggleSendModal}>
          <FaArrowUp className="icon" />
          <div className="label">Send</div>
        </div>
        <div className="wallet-action" onClick={toggleReceiveModal}>
          <FaArrowDown className="icon" />
          <div className="label">Receive</div>
        </div>
        <div className="wallet-action" onClick={()=>{
          navigate('/dashboard/presale')
        }}>
          <FaQrcode className="icon" />
          <div className="label">Swap</div>
        </div>
        <div
          className="wallet-action"
          onClick={() => {
            // 1247696
            location.href = 'https://onramp.money/app/?appId=1247696&redirectUrl=https://t.me/ploutos_labs_dev_bot/app';
          }}
        >
            <FaDollarSign className="icon" />
            <div className="label">Buy & Sell</div>
        </div>

        {/* <div
          className="wallet-action"
          onClick={() => {
            // 1247696
            // location.href = 'https://onramp.money/app/?appId=2&redirectUrl=https://t.me/ploutos_labs_dev_bot/app';
          }}
        >
          <Link to="/dashboard/onramp">
            <FaDollarSign className="icon" />
            <div className="label">Buy & Sell</div>
          </Link>
        </div> */}

        <div
          className="wallet-action"
          onClick={() => {
            location.href = 'https://p2pb2b.com/token-sale/PLTL-736/';
          }}
        >
          <FaPlay className="icon" />
          <div className="label">Launchpad</div>
        </div>
        <div className="wallet-action">
          <Link to="/game" style={{ textDecoration: 'none', color: '#ffffff' }}>
            <FaGamepad className="icon" />
            <div className="label">Games</div>
          </Link>
        </div>
      </div>
      <TokenListModal
        isOpen={sendModal}
        toggle={toggleSendModal}
        tokens={tokens}
      />
      <ReceiveTokenListModal
        isOpen={receiveModal}
        toggle={toggleReceiveModal}
        tokens={tokens}
      />
    </Container>
  );
}

BalanceCard.propTypes = {
  netWorth: PropTypes.string,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BalanceCard;
