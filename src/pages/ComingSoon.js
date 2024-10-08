import React from 'react';
import { Link } from 'react-router-dom';
import './coming-soon.css';
import TelegramBackButton from '../components/common/TelegramBackButton';

const ComingSoon = () => {
  return (
    <div className="coming-soon-page">
      <TelegramBackButton />
      <div className="coming-soon-content">
        <h1 className="coming-soon-text">COMING SOON</h1>
        <Link to="/game" className="view-all-link">
          View All
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
