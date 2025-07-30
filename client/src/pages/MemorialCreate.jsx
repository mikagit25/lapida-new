import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newMemorialService, uploadService } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import LocationPicker from '../components/LocationPicker';

const MemorialCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    biography: '',
    epitaph: '',
    profileImage: null,
    cemetery: '',
    customSlug: '',
    isPrivate: false,
    coordinates: null,
    address: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Функция для создания slug из имени
  const createSlugFromName = (firstName, lastName) => {
    const fullName = `${firstName} ${lastName}`;
    return fullName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // убираем специальные символы
      .replace(/\s+/g, '-') // заменяем пробелы на дефисы
      .trim();
  };

  // Автоматическое обновление slug при изменении имени
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    // Обновляем slug только если он пустой или совпадает с автогенерированным
    if (name === 'firstName' || name === 'lastName') {
      const autoSlug = createSlugFromName(
        name === 'firstName' ? value : formData.firstName,
        name === 'lastName' ? value : formData.lastName
      );
      
      // Обновляем slug только если пользователь не вводил его вручную
      if (!formData.customSlug || formData.customSlug === createSlugFromName(formData.firstName, formData.lastName)) {
        newFormData.customSlug = autoSlug;
      }
    }
    
    setFormData(newFormData);
  };

  const handleImageChange = (file) => {
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
  };

  // Обработчик изменения местоположения
  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        lat: locationData.lat,
        lng: locationData.lng
      },
      address: locationData.address || prev.address,
      coordinatesMethod: locationData.method
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Подготавливаем данные в правильном формате
      let profileImagePath = '';
      
      // Если есть файл изображения, загружаем его на сервер
      if (formData.profileImage) {
        try {
          const uploadResult = await uploadService.uploadSingle(formData.profileImage);
          profileImagePath = uploadResult.fileUrl;
        } catch (uploadError) {
          console.error('Ошибка загрузки изображения:', uploadError);
          // Продолжаем создание мемориала даже без изображения
        }
      }
      
      const memorialData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        deathDate: formData.deathDate,
        biography: formData.biography,
        epitaph: formData.epitaph,
        profileImage: profileImagePath,
        customSlug: formData.customSlug || null,
        isPrivate: formData.isPrivate,
        location: {
          cemetery: formData.cemetery,
          address: formData.address,
          coordinates: formData.coordinates ? {
            lat: formData.coordinates.lat,
            lng: formData.coordinates.lng
          } : undefined,
          coordinatesMethod: formData.coordinatesMethod,
          coordinatesSetAt: formData.coordinates ? new Date() : undefined
        }
      };
      
      const memorial = await newMemorialService.create(memorialData);
      
      // Перенаправляем на новый красивый URL, если slug есть, иначе на старый формат
      if (memorial.customSlug) {
        navigate(`/${memorial.customSlug}`);
      } else {
        navigate(`/memorial/${memorial.shareUrl}`);
      }
    } catch (error) {
      console.error('Ошибка создания мемориала:', error);
      alert('Ошибка при создании мемориала');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Требуется авторизация</h2>
          <p>Для создания мемориала необходимо войти в систему</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Создать мемориал</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleNameChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleNameChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* URL для мемориала */}
            <div>
              <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 mb-2">
                Адрес мемориала (необязательно)
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">
                  lapida.one/
                </span>
                <input
                  type="text"
                  id="customSlug"
                  name="customSlug"
                  value={formData.customSlug}
                  onChange={handleChange}
                  placeholder="иван-петров"
                  pattern="[a-z0-9-]+"
                  title="Только строчные буквы, цифры и дефисы"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Создайте красивую ссылку для мемориала. Оставьте пустым для автоматического создания.
              </p>
            </div>

            {/* Даты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Дата рождения *
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Дата смерти *
                </label>
                <input
                  type="date"
                  id="deathDate"
                  name="deathDate"
                  value={formData.deathDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Кладбище */}
            <div>
              <label htmlFor="cemetery" className="block text-sm font-medium text-gray-700 mb-2">
                Кладбище *
              </label>
              <input
                type="text"
                id="cemetery"
                name="cemetery"
                value={formData.cemetery}
                onChange={handleChange}
                required
                placeholder="Название кладбища"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Местоположение захоронения */}
            <LocationPicker
              onLocationChange={handleLocationChange}
              cemetery={formData.cemetery}
            />

            {/* Фото */}
            <ImageUpload
              currentImage={null}
              onImageChange={handleImageChange}
              label="Главное фото мемориала"
            />

            {/* Эпитафия */}
            <div>
              <label htmlFor="epitaph" className="block text-sm font-medium text-gray-700 mb-2">
                Эпитафия
              </label>
              <textarea
                id="epitaph"
                name="epitaph"
                value={formData.epitaph}
                onChange={handleChange}
                rows={2}
                maxLength={500}
                placeholder="Короткая памятная фраза..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.epitaph.length}/500 символов
              </p>
            </div>

            {/* Биография */}
            <div>
              <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-2">
                Биография
              </label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                rows={8}
                maxLength={5000}
                placeholder="Расскажите о жизни этого человека..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.biography.length}/5000 символов
              </p>
            </div>

            {/* Настройки приватности */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                Приватный мемориал (доступен только вам и приглашенным пользователям)
              </label>
            </div>

            {/* Кнопки */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate('/memorials')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
              >
                Отмена
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Создание...' : 'Создать мемориал'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemorialCreate;
