import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';
import './coming-soon.css';
import { useTranslation } from 'react-i18next';
const ComingSoon = () => {
  const { t } = useTranslation();
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-content">
        <h1 className="coming-soon-text">{t('common.comingSoon')}</h1>
        <Link to="/game" className="view-all-link">
          <FaGamepad /> {t('common.viewAllGames')}
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
