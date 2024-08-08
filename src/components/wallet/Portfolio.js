import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import './portfolio.css';
import { Separator } from '../common/Seperator';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import TransactionCard from './TransactionCard';
import { getTokenBalances } from '../../lib/server';

import pltlLogo from '../../assets/images/logo.png';

const Portfolio = () => {
  const { selectedWallet } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('1');

  const [tokens, setTokens] = useState([]);

  const navigate = useNavigate();
  const { selectToken } = useContext(AppContext);

  const handleTokenClick = (token) => {
    selectToken(token);
    navigate('/dashboard/send');
    toggle();
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const tokenBalances = async () => {
      if (selectedWallet) {
        const response = await getTokenBalances(selectedWallet.address);
        setTokens(response);
      }
    };

    tokenBalances();
  }, [selectedWallet]);

  return (
    <div className="portfolio">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1');
            }}
          >
            Crypto
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2');
            }}
          >
            NFTs
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              toggle('3');
            }}
          >
            Transactions
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row className="mt-4">
            {tokens.map((token) => (
              <>
                <Col
                  key={token.address}
                  xs="12"
                  className="crypto-card"
                  onClick={() => handleTokenClick(token)}
                >
                  <div className="crypto-card-content mt-2">
                    <div className="crypto-icon">
                      <img
                        src={token.logo === '' ? pltlLogo : token.logo}
                        alt={token.symbol}
                        width={45}
                        height={45}
                      />
                      <div className="crypto-info">
                        <div className="crypto-symbol">{token.symbol}</div>
                        <div className="crypto-price">
                          {token.usd_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="crypto-amount">
                      <div className="crypto-quantity">
                        {token.symbol === 'PLTL'
                          ? `${token.balance_formatted} M`
                          : token.balance_formatted}
                      </div>
                      <div className="crypto-value">
                        ${(token.balance_formatted * token.usd_price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Col>
                <Separator />
              </>
            ))}
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row className="justify-content-center align-items-center text-center">
            <div className="mt-4">
              <h4>NFTs</h4>
              <p>Coming Soon</p>
            </div>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <TransactionCard />
        </TabPane>
      </TabContent>
    </div>
  );
};

Portfolio.propTypes = {
  crypto: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      txid: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Portfolio;
