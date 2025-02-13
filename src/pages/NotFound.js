import React from 'react';
import { Container, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import './not-found.css';

const PageNotFound = () => {
  return (
    <div className="not-found-page">
      <Container>
        <div className="not-found-content">
          <div className="not-found-icon">
            <FaExclamationTriangle />
          </div>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
          <Button tag={Link} to="/dashboard/airdrop" className="home-button">
            <FaHome className="home-icon" /> Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default PageNotFound;
