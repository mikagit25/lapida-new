import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { newMemorialService } from '../services/api';

const EditableEpitaph = ({ memorial, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [epitaph, setEpitaph] = useState(memorial.epitaph || '');
  const [saving, setSaving] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Проверяем права на редактирование
  const canEdit = isAuthenticated && user && memorial.author === user._id;

  const handleSave = async () => {
    try {
      setSaving(true);
      await newMemorialService.update(memorial._id, { epitaph });
      onUpdate({ ...memorial, epitaph });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка сохранения эпитафии:', error);
      alert('Ошибка при сохранении эпитафии');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEpitaph(memorial.epitaph || '');
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditing ? (
        <div className="bg-white rounded-lg border-2 border-blue-300 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Эпитафия
          </label>
          <textarea
            value={epitaph}
            onChange={(e) => setEpitaph(e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Краткое высказывание, характеризующее жизнь..."
          />
          <div className="text-sm text-gray-500 mb-3">
            {epitaph.length}/200 символов
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 text-sm"
            >
              {saving && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          {epitaph ? (
            <blockquote className="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-4">
              "{epitaph}"
            </blockquote>
          ) : canEdit ? (
            <div className="text-gray-500 italic border-l-4 border-gray-300 pl-4 py-2">
              Нажмите, чтобы добавить эпитафию
            </div>
          ) : null}
          
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
              title="Редактировать эпитафию"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableEpitaph;
