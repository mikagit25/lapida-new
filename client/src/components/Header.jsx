import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{t('header_title')}</h2>
      <p className="text-gray-600">{t('header_in_development')}</p>
    </div>
  );
};

export default Header;
