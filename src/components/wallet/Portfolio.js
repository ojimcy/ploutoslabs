// File Path: src/components/Portfolio.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
} from 'reactstrap';
import classnames from 'classnames';
import './portfolio.css';

const Portfolio = ({ crypto, transactions }) => {
  const [activeTab, setActiveTab] = useState('1');

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
            {crypto.map((coin, index) => (
              <Col key={index} xs="12" className="crypto-card">
                <div className="crypto-card-content mt-2">
                  <div className="crypto-icon">
                    <img src={coin.icon} alt={coin.symbol} />
                    <div className="crypto-info">
                      <div className="crypto-symbol">{coin.symbol}</div>
                      <div className="crypto-price">{coin.price}</div>
                    </div>
                  </div>
                  <div className="crypto-amount">
                    <div className="crypto-quantity">{coin.quantity}</div>
                    <div className="crypto-value">
                      ${(coin.quantity * coin.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Col>
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
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.txid}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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
