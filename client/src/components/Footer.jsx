import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{t('footer_title')}</h2>
      <p className="text-gray-600">{t('footer_in_development')}</p>
    </div>
  );
};

export default Footer;
