import React from 'react';

const BulkProductActions = ({ onAdd, onBulkAction, onSaveAll }) => (
  <div className="flex space-x-2 mb-4">
    <button type="button" onClick={onAdd} className="bg-green-600 text-white px-4 py-2 rounded">Добавить товар</button>
    <button type="button" onClick={() => onBulkAction('delete')} className="bg-red-600 text-white px-4 py-2 rounded">Удалить выбранные</button>
    <button type="button" onClick={() => onBulkAction('publish')} className="bg-blue-600 text-white px-4 py-2 rounded">Опубликовать выбранные</button>
    <button type="button" onClick={onSaveAll} className="bg-indigo-600 text-white px-4 py-2 rounded">Сохранить все</button>
  </div>
);

export default BulkProductActions;
