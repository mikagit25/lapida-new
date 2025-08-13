import React, { useState } from 'react';
import CommentSection from './CommentSection';

const CollapsibleComments = ({ memorialId, comments, onNewComment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const commentsCount = comments ? comments.length : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Воспоминания и соболезнования
          </h3>
          {commentsCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {commentsCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-sm">
            {isExpanded ? 'Скрыть' : 'Показать'}
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
      </div>

      {/* Краткая информация в свернутом состоянии */}
      {!isExpanded && commentsCount > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          <p>
            {commentsCount === 1 
              ? 'Одно воспоминание' 
              : `${commentsCount} воспоминаний`
            }. Нажмите, чтобы прочитать.
          </p>
        </div>
      )}

      {!isExpanded && commentsCount === 0 && (
        <div className="mt-3 text-sm text-gray-500">
          <p>Поделитесь воспоминанием или выразите соболезнования</p>
        </div>
      )}

      {/* Развернутый контент */}
      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <CommentSection
            memorialId={memorialId}
            comments={comments}
            onNewComment={onNewComment}
          />
        </div>
      )}
    </div>
  );
};

export default CollapsibleComments;