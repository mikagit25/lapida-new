import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TimelineEvent from './TimelineEvent';
import EventModal from './EventModal';
import TimelineStats from './TimelineStats';
import { getApiBaseUrl } from '../config/api';

const LifeTimeline = ({ memorialId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Типы событий
  const eventTypes = [
    { value: 'birth', label: 'Рождение', icon: '👶' },
    { value: 'education', label: 'Образование', icon: '🎓' },
    { value: 'career', label: 'Карьера', icon: '💼' },
    { value: 'family', label: 'Семья', icon: '👨‍👩‍👧‍👦' },
    { value: 'achievement', label: 'Достижения', icon: '🏆' },
    { value: 'travel', label: 'Путешествия', icon: '✈️' },
    { value: 'health', label: 'Здоровье', icon: '🏥' },
    { value: 'hobby', label: 'Увлечения', icon: '🎨' },
    { value: 'life', label: 'Жизнь', icon: '🌟' },
    { value: 'other', label: 'Другое', icon: '📅' }
  ];

  useEffect(() => {
    loadEvents();
    loadStats();
  }, [memorialId, filter, selectedYear]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        memorialId,
        ...(filter !== 'all' && { eventType: filter }),
        ...(selectedYear !== 'all' && { year: selectedYear })
      });

      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/timeline/timeline?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : (data.events || []));
        setDebugInfo(null);
      } else {
        let text = await response.text();
        setError('Ошибка загрузки событий');
        setDebugInfo(`HTTP ${response.status}: ${text}`);
      }
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
      setError('Ошибка загрузки событий');
      setDebugInfo(error?.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/timeline/timeline/stats?memorialId=${memorialId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const getEventIcon = (eventType) => {
    const type = eventTypes.find(t => t.value === eventType);
    return type?.icon || '📅';
  };

  const getEventTypeLabel = (eventType) => {
    const type = eventTypes.find(t => t.value === eventType);
    return type?.label || eventType;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableYears = () => {
    const years = [...new Set(events.map(event => 
      new Date(event.date).getFullYear()
    ))].sort((a, b) => b - a);
    return years;
  };

  const handleEventSave = async () => {
    setShowAddForm(false);
    setEditingEvent(null);
    await loadEvents();
    await loadStats();
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/timeline/timeline/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadEvents();
        await loadStats();
      } else {
        alert('Ошибка при удалении события');
      }
    } catch (error) {
      console.error('Ошибка удаления события:', error);
      alert('Ошибка при удалении события');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">❌ {error}</div>
        {debugInfo && (
          <pre className="text-xs text-gray-500 bg-gray-100 rounded p-2 overflow-x-auto max-w-xl mx-auto mt-2">{debugInfo}</pre>
        )}
        <button
          onClick={loadEvents}
          className="text-blue-500 hover:text-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Кнопка добавления */}
      {isAuthenticated && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Добавить событие</span>
          </button>
        </div>
      )}

      {/* Статистика */}
      <TimelineStats 
        stats={stats} 
        getEventTypeLabel={getEventTypeLabel}
        eventTypes={eventTypes}
      />

      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Фильтр по типу */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип события
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все события</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Год
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все годы</option>
              {getAvailableYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* События */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <p className="text-gray-500 text-lg mb-2">Пока нет событий</p>
          <p className="text-gray-400 text-sm">
            {filter === 'all' 
              ? 'Добавьте первое событие из жизни' 
              : `Нет событий в категории "${getEventTypeLabel(filter)}"`
            }
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Добавить событие
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Заголовок с возможностью сворачивания */}
          <div 
            className="flex items-center justify-between cursor-pointer mb-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                📅 Лента жизни
              </h3>
              {events.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {events.length}
                </span>
              )}
            </div>
            
            {events.length > 3 && (
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-sm">
                  {isExpanded ? 'Скрыть' : `Показать еще ${events.length - 3}`}
                </span>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Краткая информация в свернутом состоянии */}
          {!isExpanded && events.length > 3 && (
            <div className="mb-4 text-sm text-gray-600">
              Показано {Math.min(3, events.length)} из {events.length} событий
            </div>
          )}

          <div className="relative">
            {/* Вертикальная линия */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            <div className="space-y-8">
              {(isExpanded ? events : events.slice(0, 3)).map((event, index) => (
                <TimelineEvent
                  key={event._id}
                  event={event}
                  index={index}
                  getEventIcon={getEventIcon}
                  getEventTypeLabel={getEventTypeLabel}
                  formatDate={formatDate}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onEdit={setEditingEvent}
                  onDelete={() => {
                    if (window.confirm('Удалить это событие?')) {
                      handleDeleteEvent(event._id);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Модальные окна */}
      {showAddForm && (
        <EventModal
          memorialId={memorialId}
          onClose={() => setShowAddForm(false)}
          onSave={handleEventSave}
          eventTypes={eventTypes}
        />
      )}

      {editingEvent && (
        <EventModal
          memorialId={memorialId}
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleEventSave}
          eventTypes={eventTypes}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default LifeTimeline;