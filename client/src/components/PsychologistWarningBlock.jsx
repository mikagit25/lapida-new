/** Компонент предупреждения для AI-психолога */
import React from 'react';
import { useTranslation } from 'react-i18next';

const PsychologistWarningBlock = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-sm text-gray-700">
      {t('psychologist_warning')}
    </div>
  );
};

export default PsychologistWarningBlock;
