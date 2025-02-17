import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';
import './coming-soon.css';

const ComingSoon = () => {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-content">
        <h1 className="coming-soon-text">COMING SOON</h1>
        <Link to="/game" className="view-all-link">
          <FaGamepad /> View All Games
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
