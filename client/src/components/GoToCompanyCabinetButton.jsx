import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Кнопка перехода из личного кабинета пользователя в кабинет компании
 * @param {Array} companies - массив компаний пользователя
 */
const GoToCompanyCabinetButton = ({ companies }) => {
  console.log('[GoToCompanyCabinetButton] companies:', companies);
  if (!companies || companies.length === 0) return null;
  // Переход только к первой компании (или можно сделать выбор)
  const company = companies[0];
  return (
    <Link
      to={company.customSlug ? `/company/${company.customSlug}` : `/company/${company._id}`}
      className="bg-blue-600 text-white px-4 py-2 rounded mb-2 inline-block"
    >
      {company.name ? `Перейти в профиль компании: ${company.name}` : 'Перейти в профиль компании'}
    </Link>
  );
};

export default GoToCompanyCabinetButton;
