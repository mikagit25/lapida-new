import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { newMemorialService } from '../services/api';

const EditableBiography = ({ memorial, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [biography, setBiography] = useState(memorial.biography || '');
  const [saving, setSaving] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Проверяем права на редактирование
  const canEdit = isAuthenticated && user && memorial.author === user._id;

  const handleSave = async () => {
    try {
      setSaving(true);
      await newMemorialService.update(memorial._id, { biography });
      onUpdate({ ...memorial, biography });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка сохранения биографии:', error);
      alert('Ошибка при сохранении биографии');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBiography(memorial.biography || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Биография</h2>
        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Редактировать</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Расскажите о жизни, достижениях, интересах..."
          />
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
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
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none text-gray-700">
          {biography ? (
            biography.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))
          ) : (
            <div className="text-gray-500 italic text-center py-8">
              {canEdit ? (
                <>
                  Биография пока не добавлена.{' '}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Добавить биографию
                  </button>
                </>
              ) : (
                'Биография пока не добавлена.'
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableBiography;
