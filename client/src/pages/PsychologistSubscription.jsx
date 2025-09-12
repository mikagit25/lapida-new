import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PsychologistSubscription = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{t('psy_sub_title')}</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
        <p className="mb-2">{t('psy_sub_limited_text')}</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
          <li>{t('psy_sub_benefit_unlimited')}</li>
          <li>{t('psy_sub_benefit_history')}</li>
          <li>{t('psy_sub_benefit_support')}</li>
          <li>{t('psy_sub_benefit_future')}</li>
        </ul>
        <p className="text-gray-500 text-xs">{t('psy_sub_demo_note')}</p>
      </div>
      <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold mb-4" disabled>{t('psy_sub_btn_soon')}</button>
      <div>
        <Link to="/psychologist" className="text-blue-600 underline">{t('psy_sub_back_to_chat')}</Link>
      </div>
    </div>
  );
};

export default PsychologistSubscription;
