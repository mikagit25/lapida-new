import React from 'react';
import { Link } from 'react-router-dom';
import GoToConnectionsButton from './GoToConnectionsButton';

/**
 * Компонент для отображения кнопок перехода в личные кабинеты компаний пользователя
 * @param {Array} companies - массив компаний пользователя
 */
const CompanyCabinetQuickActions = ({ companies }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Array.isArray(companies) && companies.length > 0 && companies.map((company) => (
        <Link
          key={company._id}
          to={company.customSlug ? `/company/${company.customSlug}` : `/company/${company._id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-2 inline-block"
        >
          {company.name ? `Профиль: ${company.name}` : 'Профиль компании'}
        </Link>
      ))}
      <GoToConnectionsButton />
    </div>
  );
};

export default CompanyCabinetQuickActions;
