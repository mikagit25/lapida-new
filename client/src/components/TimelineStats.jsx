import React from 'react';

const TimelineStats = ({ stats, getEventTypeLabel, eventTypes }) => {
  if (!stats) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Статистика жизни
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
          <div className="text-sm text-gray-600">Всего событий</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.eventsThisYear}</div>
          <div className="text-sm text-gray-600">В этом году</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.yearsSpan}</div>
          <div className="text-sm text-gray-600">Лет охвачено</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.avgEventsPerYear}</div>
          <div className="text-sm text-gray-600">Событий в год</div>
        </div>
      </div>

      {/* По типам событий */}
      {stats.byEventType && Object.keys(stats.byEventType).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">По категориям:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byEventType).map(([type, count]) => {
              const eventType = eventTypes.find(et => et.value === type);
              return (
                <div key={type} className="bg-white rounded-full px-3 py-1 text-sm">
                  <span className="mr-1">{eventType?.icon || '📅'}</span>
                  <span className="font-medium">{count}</span>
                  <span className="text-gray-600 ml-1">{eventType?.label || type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineStats;
