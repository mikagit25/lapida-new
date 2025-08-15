import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

export default function CompanyMap({ address, lat, lng, setAddress, setLat, setLng, foundAddress, setFoundAddress, mapError, setMapError }) {
  const mapRef = useRef();

  // Поиск адреса через Nominatim
  const geocodeAddress = async (addr) => {
    if (!addr) return;
    setMapError('');
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        setLat(parseFloat(data[0].lat));
        setLng(parseFloat(data[0].lon));
        setFoundAddress(data[0].display_name);
        if (mapRef.current) {
          mapRef.current.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 15);
        }
      } else {
        setMapError('Адрес не найден');
      }
    } catch (e) {
      setMapError('Ошибка поиска адреса');
    }
  };

  // Обработчик клика по карте
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        setFoundAddress('');
        if (mapRef.current) {
          mapRef.current.setView([e.latlng.lat, e.latlng.lng], mapRef.current.getZoom());
        }
      }
    });
    return null;
  }

  return (
    <div>
      <div className="mb-2">
        <input
          className="border px-3 py-2 rounded w-full"
          value={address || ''}
          onChange={e => setAddress(e.target.value)}
          placeholder="Адрес компании"
        />
        <button type="button" className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded" onClick={() => geocodeAddress(address)}>Поиск на карте</button>
        {mapError && <div className="text-red-600 text-sm mt-1">{mapError}</div>}
        {(lat && lng) && (
          <div className="text-xs text-gray-600 mt-1">Координаты: {lat}, {lng}</div>
        )}
        {foundAddress && (
          <div className="text-xs text-blue-700 mt-1">Найдено: {foundAddress}</div>
        )}
      </div>
      <div className="mt-4">
        <MapContainer
          center={lat && lng ? [lat, lng] : [55.751244, 37.618423]}
          zoom={lat && lng ? 15 : 10}
          style={{ height: '300px', width: '100%' }}
          scrollWheelZoom={true}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapClickHandler />
          <Marker
            position={lat && lng ? [lat, lng] : [55.751244, 37.618423]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                setLat(position.lat);
                setLng(position.lng);
                if (mapRef.current) {
                  mapRef.current.setView([position.lat, position.lng], mapRef.current.getZoom());
                }
              }
            }}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              shadowSize: [41, 41]
            })}
          >
            <Popup>Точка компании</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
