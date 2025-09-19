// Импорт и объединение всех блоков для панели управления религиозной организацией
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReligiousOrgProfile from './ReligiousOrgProfile';
import ReligiousOrgServices from './ReligiousOrgServices';
import ReligiousOrgProducts from './ReligiousOrgProducts';
import ReligiousOrgOrders from './ReligiousOrgOrders';
import ReligiousOrgReviews from './ReligiousOrgReviews';

const ReligiousOrgDashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="religious-org-dashboard">
      <h1>{t('religiousOrgDashboard.title')}</h1>
      <ReligiousOrgProfile />
      <ReligiousOrgServices />
      <ReligiousOrgProducts />
      <ReligiousOrgOrders />
      <ReligiousOrgReviews />
    </div>
  );
};

export default ReligiousOrgDashboard;
