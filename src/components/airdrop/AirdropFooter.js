import React from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FiList, FiActivity, FiUsers, FiAward } from 'react-icons/fi';
import './airdrop.css';

function AirdropFooter() {
  return (
    <Row className="text-center airdrop-footer">
      <Col xs="3" className="footer-link">
        <Link
          to="/dashboard/tasks"
          className="d-flex flex-column align-items-center"
        >
          <FiList size={20} className="icon" />
          <span className="mt-2">Tasks</span>
        </Link>
      </Col>
      <Col xs="3" className="footer-link">
        <Link
          to="/dashboard/boosts"
          className="d-flex flex-column align-items-center"
        >
          <FiActivity size={20} className="icon" />
          <span className="mt-2">Boost</span>
        </Link>
      </Col>
      <Col xs="3" className="footer-link">
        <Link
          to="/dashboard/referrals"
          className="d-flex flex-column align-items-center"
        >
          <FiUsers size={20} className="icon" />
          <span className="mt-2">Referrals</span>
        </Link>
      </Col>
      <Col xs="3" className="footer-link">
        <Link
          to="/dashboard/ref-leaderboard"
          className="d-flex flex-column align-items-center"
        >
          <FiAward size={20} className="icon" />
          <span className="mt-2">Leaderboard</span>
        </Link>
      </Col>
    </Row>
  );
}

export default AirdropFooter;
