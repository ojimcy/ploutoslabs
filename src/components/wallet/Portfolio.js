// File Path: src/components/Portfolio.js

import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import './portfolio.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CryptoCard from './CryptoCard';
import TransactionCard from './TransactionCard';

const Portfolio = ({ crypto, transactions }) => {
  const [activeTab, setActiveTab] = useState('1');

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
            {crypto.map((token, index) => (
              <CryptoCard
                key={index}
                token={token}
                onClick={handleTokenClick}
              />
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
          <Row className="mt-4">
            {transactions.map((trx, index) => (
              <TransactionCard key={index} transaction={trx} />
            ))}
          </Row>
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
      icon: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Portfolio;
