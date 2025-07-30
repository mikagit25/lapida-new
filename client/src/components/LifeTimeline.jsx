import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { timelineService } from '../services/api';
import TimelineEvent from './TimelineEvent';
import EventModal from './EventModal';
import TimelineStats from './TimelineStats';

const LifeTimeline = ({ memorialId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [stats, setStats] = useState(null);
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
      const params = {
        ...(filter !== 'all' && { eventType: filter }),
        ...(selectedYear !== 'all' && { year: selectedYear })
      };

      const data = await timelineService.getByMemorial(memorialId, params);
      setEvents(data);
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
      setError('Ошибка загрузки событий');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Пока используем fetch для статистики, так как эндпоинт может отличаться
      const response = await fetch(`http://localhost:5002/api/timeline/timeline/stats?memorialId=${memorialId}`);
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
      await timelineService.delete(eventId);
      await loadEvents();
      await loadStats();
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          📅 Лента жизни
        </h2>
        {isAuthenticated && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Добавить событие</span>
          </button>
        )}
      </div>

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
        <div className="relative">
          {/* Вертикальная линия */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          <div className="space-y-8">
            {events.map((event, index) => (
              <TimelineEvent
                key={event._id}
                event={event}
                index={index}
                memorialId={memorialId}
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