import React from 'react';
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

const LocationView = ({ memorial }) => {
  const { location } = memorial;
  
  // Если нет данных о местоположении, показываем только текстовую информацию
  if (!location || !location.cemetery) {
    return null;
  }

  const hasCoordinates = location.coordinates && 
                        location.coordinates.lat && 
                        location.coordinates.lng;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Место захоронения
      </h3>
      
      <div className="space-y-3">
        {/* Название кладбища */}
        <div>
          <span className="text-gray-600 block text-sm">Кладбище</span>
          <span className="font-semibold text-gray-900">{location.cemetery}</span>
        </div>

        {/* Секция кладбища */}
        {location.section && (
          <div>
            <span className="text-gray-600 block text-sm">Секция</span>
            <span className="font-semibold text-gray-900">{location.section}</span>
          </div>
        )}

        {/* Участок */}
        {location.plot && (
          <div>
            <span className="text-gray-600 block text-sm">Участок</span>
            <span className="font-semibold text-gray-900">{location.plot}</span>
          </div>
        )}

        {/* Адрес */}
        {location.address && (
          <div>
            <span className="text-gray-600 block text-sm">Адрес</span>
            <span className="font-semibold text-gray-900">{location.address}</span>
          </div>
        )}

        {/* Карта */}
        {hasCoordinates && (
          <div className="mt-4">
            <div className="h-48 border border-gray-300 rounded-md overflow-hidden">
              <MapContainer
                center={[location.coordinates.lat, location.coordinates.lng]}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[location.coordinates.lat, location.coordinates.lng]}>
                  <Popup>
                    <div className="text-center">
                      <strong>{location.cemetery}</strong>
                      {location.section && <br />}
                      {location.section && `Секция: ${location.section}`}
                      {location.plot && <br />}
                      {location.plot && `Участок: ${location.plot}`}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            
            {/* Координаты */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              Координаты: {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
              {location.coordinatesMethod && (
                <span className="ml-2">
                  ({location.coordinatesMethod === 'gps' ? 'GPS' : 
                    location.coordinatesMethod === 'address' ? 'По адресу' : 'Вручную'})
                </span>
              )}
              {location.coordinatesSetAt && (
                <span className="block">
                  Установлено: {new Date(location.coordinatesSetAt).toLocaleDateString('ru-RU')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Если координат нет, показываем сообщение */}
        {!hasCoordinates && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-center">
            <p className="text-gray-600 text-sm">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Точные координаты местоположения не указаны
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationView;