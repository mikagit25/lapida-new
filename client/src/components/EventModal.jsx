import React, { useState } from 'react';
import { timelineService } from '../services/api';

const EventModal = ({ 
  memorialId, 
  event = null, 
  onClose, 
  onSave, 
  eventTypes,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    eventType: event?.eventType || 'life',
    location: event?.location || '',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      // Добавляем текстовые поля
      formDataToSend.append('title', formData.title);
      
      // Добавляем только заполненные поля
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      
      if (formData.date) {
        formDataToSend.append('date', formData.date);
        // Автоматически генерируем dateDisplay на основе даты
        const dateObj = new Date(formData.date);
        const dateDisplay = dateObj.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        formDataToSend.append('dateDisplay', dateDisplay);
      }
      
      formDataToSend.append('eventType', formData.eventType);
      
      if (formData.location) {
        formDataToSend.append('location', formData.location);
      }
      
      formDataToSend.append('memorialId', memorialId);

      // Добавляем фотографии
      formData.photos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });

      if (isEditing) {
        await timelineService.update(event._id, formDataToSend);
      } else {
        await timelineService.create(memorialId, formDataToSend);
      }

      onSave();
    } catch (error) {
      console.error('Ошибка сохранения события:', error);
      setError(error.response?.data?.message || 'Ошибка сохранения события');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Редактировать событие' : 'Добавить событие'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Название */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название события *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Например: Рождение, Свадьба, Поступление в университет..."
              />
            </div>

            {/* Дата */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата события
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Тип события */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип события
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Место */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Место
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Город, страна или конкретный адрес..."
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Расскажите подробнее об этом событии..."
              />
            </div>

            {/* Фотографии */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографии
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Можно выбрать несколько фотографий (до 10 файлов, каждый до 5MB)
              </p>
            </div>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || formData.title.trim() === ''}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : (isEditing ? 'Сохранить' : 'Добавить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
