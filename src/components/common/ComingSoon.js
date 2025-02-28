/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import './ComingSoonPage.css';
import { useTranslation } from 'react-i18next';
export default function ComingSoonPage() {
  const { t } = useTranslation();
  return (
    <div className="coming-soon-page bg-primary-light">
      <div className="section-title text-center">
        <h1 className="title">{t('common.comingSoon')}</h1>
        <p className="description">{t('common.comingSoonDescription')}</p>
      </div>
    </div>
  );
}
