import React from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { FaPlus, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './wallets.css';

const wallets = [
  {
    name: 'Account 1',
    balance: '6.803827164444447',
    address: '0x123...789abc',
  },
  {
    name: 'Account 2',
    balance: '12.456789123456789',
    address: '0x456...def012',
  },
];
const ViewWallets = () => {

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h1>Your Wallets</h1>
          <p>Manage all your cryptocurrency accounts in one place.</p>
        </Col>
      </Row>
      <Row>
        {wallets.map((wallet) => (
          <Col md="4" key={wallet.id} className="mb-3">
            <Card>
              <CardBody>
                <div className="wallet-card-content">
                  <div className="wallet-icon">
                    <FaWallet />
                  </div>
                  <div className="wallet-info">
                    <div className="wallet-title">{wallet.name}</div>
                    <div className="wallet-balance">{wallet.balance} PLTL</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
        <Col md="4" className="mb-3">
          <Card className="add-wallet-card">
            <CardBody>
              <Link to="/create" className="links">
                <div className="wallet-card-content">
                  <div className="wallet-icon">
                    <FaPlus />
                  </div>
                  <div className="wallet-info">
                    <div className="wallet-title">Add New Wallet</div>
                  </div>
                </div>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewWallets;
