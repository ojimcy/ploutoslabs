/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'reactstrap';
import './utilities.css';

function AirtimeSummary({ utilityTransaction, walletBalance }) {
  return (
    <div className="airtime-summary">
      <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
      <Row className="mb-4">
        <Col md="12">
          <div className="d-flex justify-content-between mb-3">
            <strong>Utility Type:</strong>
            <span>{utilityTransaction.utilityType}</span>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <strong>Network Provider:</strong>
            <span>{utilityTransaction.networkProvider || 'N/A'}</span>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <strong>Phone Number:</strong>
            <span>{utilityTransaction.phoneNumber || 'N/A'}</span>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <strong>Amount:</strong>
            <span>₦{utilityTransaction.amount}</span>
          </div>
        </Col>
      </Row>

      <div className="wallet-balance-card">
        <h5>Wallet Balance</h5>
        <p>
          <strong>${walletBalance}</strong>
        </p>
      </div>
    </div>
  );
}

export default AirtimeSummary;
