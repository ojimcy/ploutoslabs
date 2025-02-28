import React from 'react';
import { Row, Col } from 'reactstrap';
import airdropLogo from '../../assets/images/airdrop-logo.png';

import './wallet.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ClaimCard() {
  const { t } = useTranslation();
  return (
    <div className=" claim-card mt-5 w-100">
      <Row className="w-100">
        <Col xs={4}>
          <img src={airdropLogo} alt="" />
        </Col>
        <Col xs={8} className="mt-3">
          {/* TODO: go to airdrop if its not users' first claim  */}
          <h5 className="claim-title">{t('wallet.claimTitle')}</h5>
          <Link className="claim-btn" to="/dashboard/airdrop">
            {t('common.claim')}
          </Link>
        </Col>
      </Row>
    </div>
  );
}

export default ClaimCard;
