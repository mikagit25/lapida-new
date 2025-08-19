import React from 'react';
import { Link } from 'react-router-dom';

function PersonalCabinetActivity({ recentActivity, formatDate, getActivityIcon, getActivityText }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Моя активность</h2>
        <Link
          to="/profile?tab=my-activity"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Все →
        </Link>
      </div>
      {recentActivity.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-gray-400 text-3xl mb-2">💬</div>
          <p className="text-gray-500 text-sm">Нет активности</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((activity) => (
            <div key={activity._id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <span className="text-lg">{getActivityIcon(activity)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {getActivityText(activity)}
                </p>
                {activity.memorial && (
                  <p className="text-xs text-gray-600">
                    {activity.memorial.firstName} {activity.memorial.lastName}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalCabinetActivity;
