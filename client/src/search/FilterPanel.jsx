import React from 'react';

const FilterPanel = ({ filters, onChange }) => {
  return (
    <div className="filter-panel">
      <label>
        Тип:
        <select name="type" value={filters.type} onChange={onChange}>
          <option value="">Все</option>
          <option value="memorial">Мемориалы</option>
          <option value="user">Пользователи</option>
          <option value="company">Компании</option>
        </select>
      </label>
      <label>
        Дата:
        <input type="date" name="date" value={filters.date} onChange={onChange} />
      </label>
      <label>
        Статус:
        <select name="status" value={filters.status} onChange={onChange}>
          <option value="">Все</option>
          <option value="active">Активные</option>
          <option value="archived">Архив</option>
        </select>
      </label>
    </div>
  );
};

export default FilterPanel;
