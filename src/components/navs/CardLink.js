import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function CardLink({ to, icon, title }) {
  return (
    <Link to={to} className="links">
      <div className="referral-card-content my-4">
        <div className="referral-icon">
          <div className="ref-icon">{icon}</div>
          <div className="referral-info">
            <div className="ref-title">{title}</div>
          </div>
        </div>
        <div className="right">
          <div className="right-arrow">
            <FaArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}

CardLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
};

export default CardLink;
