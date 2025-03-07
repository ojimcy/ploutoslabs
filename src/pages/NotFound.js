import React from 'react';
import { Container, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import './not-found.css';
import { useTranslation } from 'react-i18next';
const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found-page">
      <Container>
        <div className="not-found-content">
          <div className="not-found-icon">
            <FaExclamationTriangle />
          </div>
          <h1>404</h1>
          <h2>{t('common.pageNotFound')}</h2>
          <p>
            {t('common.pageNotFoundDescription')}
          </p>
          <Button tag={Link} to="/dashboard/airdrop" className="home-button">
            <FaHome className="home-icon" /> {t('modal.backToHome')}
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default PageNotFound;
