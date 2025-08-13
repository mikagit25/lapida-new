import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { newMemorialService } from '../services/api';
import LocationPicker from './LocationPicker';
import GravePhotoGallery from './GravePhotoGallery';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Иконка маркера для Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EditableLocation = ({ memorial, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    cemetery: memorial.location?.cemetery || '',
    section: memorial.location?.section || '',
    plot: memorial.location?.plot || '',
    address: memorial.location?.address || '',
    coordinates: memorial.location?.coordinates || null
  });

  // Проверяем права на редактирование
  const canEdit = user && (memorial.createdBy === user.id || memorial.createdBy._id === user.id || memorial.createdBy.toString() === user.id);

  const handleLocationChange = (newLocationData) => {
    setLocationData(prev => ({
      ...prev,
      coordinates: {
        lat: newLocationData.lat,
        lng: newLocationData.lng
      },
      address: newLocationData.address || prev.address,
      coordinatesMethod: newLocationData.method
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!locationData.cemetery.trim()) {
      alert('Название кладбища обязательно');
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        location: {
          cemetery: locationData.cemetery,
          section: locationData.section,
          plot: locationData.plot,
          address: locationData.address,
          coordinates: locationData.coordinates,
          coordinatesMethod: locationData.coordinatesMethod,
          coordinatesSetAt: locationData.coordinates ? new Date() : undefined
        }
      };

      const updatedMemorial = await newMemorialService.update(memorial._id, updatedData);
      onUpdate(updatedMemorial);
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка обновления местоположения:', error);
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocationData({
      cemetery: memorial.location?.cemetery || '',
      section: memorial.location?.section || '',
      plot: memorial.location?.plot || '',
      address: memorial.location?.address || '',
      coordinates: memorial.location?.coordinates || null
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Редактирование места захоронения
          </h3>
        </div>

        <div className="space-y-4">
          {/* Основные поля */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Кладбище *
            </label>
            <input
              type="text"
              name="cemetery"
              value={locationData.cemetery}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Название кладбища"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Секция
              </label>
              <input
                type="text"
                name="section"
                value={locationData.section}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Секция кладбища"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Участок
              </label>
              <input
                type="text"
                name="plot"
                value={locationData.plot}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Номер участка"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Адрес
            </label>
            <input
              type="text"
              name="address"
              value={locationData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Полный адрес кладбища"
            />
          </div>

          {/* Карта и фото в сетке */}
          <div className="space-y-6">
            {/* Галерея фото захоронения */}
            <div>
              <GravePhotoGallery memorial={memorial} onUpdate={onUpdate} />
            </div>

            {/* Карта для выбора координат */}
            <div>
              <LocationPicker
                initialCoordinates={locationData.coordinates ? [locationData.coordinates.lat, locationData.coordinates.lng] : null}
                onLocationChange={handleLocationChange}
                cemetery={locationData.cemetery}
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Обычный режим просмотра
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Место захоронения
        </h3>
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Редактировать
          </button>
        )}
      </div>

      {memorial.location?.cemetery ? (
        <div className="space-y-3">
          <div>
            <span className="text-gray-600 block text-sm">Кладбище</span>
            <span className="font-semibold text-gray-900">{memorial.location.cemetery}</span>
          </div>

          {memorial.location.section && (
            <div>
              <span className="text-gray-600 block text-sm">Секция</span>
              <span className="font-semibold text-gray-900">{memorial.location.section}</span>
            </div>
          )}

          {memorial.location.plot && (
            <div>
              <span className="text-gray-600 block text-sm">Участок</span>
              <span className="font-semibold text-gray-900">{memorial.location.plot}</span>
            </div>
          )}

          {memorial.location.address && (
            <div>
              <span className="text-gray-600 block text-sm">Адрес</span>
              <span className="font-semibold text-gray-900">{memorial.location.address}</span>
            </div>
          )}

          {/* Карта и фото в режиме просмотра */}
          {memorial.location.coordinates && memorial.location.coordinates.lat && memorial.location.coordinates.lng && (
            <div className="mt-4">
              {/* Карта */}
              <div className="mb-6">
                <span className="text-gray-600 block text-sm mb-2">Местоположение на карте</span>
                <div className="h-48 border border-gray-300 rounded-md overflow-hidden">
                  <MapContainer
                    center={[memorial.location.coordinates.lat, memorial.location.coordinates.lng]}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[memorial.location.coordinates.lat, memorial.location.coordinates.lng]}>
                      <Popup>
                        <div className="text-center">
                          <strong>{memorial.location.cemetery}</strong>
                          {memorial.location.section && <br />}
                          {memorial.location.section && `Секция: ${memorial.location.section}`}
                          {memorial.location.plot && <br />}
                          {memorial.location.plot && `Участок: ${memorial.location.plot}`}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                
                {/* Координаты */}
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Координаты: {memorial.location.coordinates.lat.toFixed(6)}, {memorial.location.coordinates.lng.toFixed(6)}
                  {memorial.location.coordinatesMethod && (
                    <span className="ml-2">
                      ({memorial.location.coordinatesMethod === 'gps' ? 'GPS' : 
                        memorial.location.coordinatesMethod === 'address' ? 'По адресу' : 'Вручную'})
                    </span>
                  )}
                  {memorial.location.coordinatesSetAt && (
                    <span className="block">
                      Установлено: {new Date(memorial.location.coordinatesSetAt).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>
              </div>

              {/* Галерея фото захоронения */}
              <div>
                <GravePhotoGallery memorial={memorial} onUpdate={onUpdate} />
              </div>
            </div>
          )}

          {/* Если координат нет, показываем сообщение и фото */}
          {!memorial.location.coordinates?.lat && (
            <div className="mt-4">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-center mb-6">
                <p className="text-gray-600 text-sm">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Точные координаты местоположения не указаны
                </p>
              </div>
              
              {/* Галерея фото захоронения */}
              <GravePhotoGallery memorial={memorial} onUpdate={onUpdate} />
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Место захоронения не указано</p>
      )}
    </div>
  );
};

export default EditableLocation;
