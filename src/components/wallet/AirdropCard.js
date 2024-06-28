import React from 'react';
import { Row, Col } from 'reactstrap';
import airdropLogo from '../../assets/images/airdrop-logo.png';

import './wallet.css';
import { Link } from 'react-router-dom';

function AirdropCard() {
  return (
    <div className=" claim-card mt-5 w-100">
      <Row className="w-100">
        <Col xs={4}>
          <img src={airdropLogo} alt="" />
        </Col>
        <Col xs={8} className="mt-3">
          {/* TODO: go to airdrop if its not users' first claim  */}
          <h5 className="claim-title">Start mining free PLTL</h5>
          <Link className="claim-btn" href="/#/admin/airdrop">
            Claim
          </Link>
        </Col>
      </Row>
    </div>
  );
}

export default AirdropCard;
