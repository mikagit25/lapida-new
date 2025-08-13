import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Иконка маркера для Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Компонент для обработки кликов по карте
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng, 'manual');
    }
  });
  return null;
};

const LocationPicker = ({ 
  initialCoordinates = null, 
  onLocationChange,
  cemetery = ''
}) => {
  const [position, setPosition] = useState(initialCoordinates);
  const [isGPSLoading, setIsGPSLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');

  // Центр карты по умолчанию (Минск)
  const defaultCenter = [53.9006, 27.5590];
  const mapCenter = position || defaultCenter;

  const handleLocationSelect = (lat, lng, method) => {
    const newPosition = [lat, lng];
    setPosition(newPosition);
    setError('');
    
    if (onLocationChange) {
      onLocationChange({
        lat,
        lng,
        method,
        address
      });
    }
  };

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается браузером');
      return;
    }

    setIsGPSLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationSelect(latitude, longitude, 'gps');
        setIsGPSLoading(false);
      },
      (error) => {
        setError('Не удалось определить местоположение');
        setIsGPSLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) return;

    try {
      // Используем Nominatim API для геокодирования
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ' ' + cemetery)}&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        handleLocationSelect(lat, lng, 'address');
      } else {
        setError('Адрес не найден');
      }
    } catch (error) {
      setError('Ошибка поиска адреса');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Местоположение захоронения</h3>
        
        {/* Кнопки управления */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            type="button"
            onClick={handleGPSLocation}
            disabled={isGPSLoading}
            className="flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
          >
            {isGPSLoading ? (
              <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            {isGPSLoading ? 'Определение...' : 'Моё местоположение'}
          </button>

          <div className="flex">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Введите адрес"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
            >
              Найти
            </button>
          </div>
        </div>

        {/* Ошибки */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Карта */}
        <div className="h-64 border border-gray-300 rounded-md overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={position ? 16 : 10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            {position && (
              <Marker position={position} />
            )}
          </MapContainer>
        </div>

        {/* Информация о выбранной точке */}
        {position && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">
              <strong>Координаты:</strong> {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Кликните на карту, чтобы выбрать точное местоположение захоронения
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;