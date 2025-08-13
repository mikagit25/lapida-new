import React from 'react';
import { useApiConnection } from '../hooks/useApiConnection';

const ConnectionStatus = () => {
    const { apiUrl, isConnected, isSearching, error, retryConnection } = useApiConnection();

    if (isSearching) {
        return (
            <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="text-sm">Поиск сервера...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Сервер недоступен</span>
                        <button 
                            onClick={retryConnection}
                            className="text-xs underline hover:no-underline"
                        >
                            Повторить попытку
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
                    <span className="text-sm">Переподключение...</span>
                </div>
            </div>
        );
    }

    // Показываем только если API URL отличается от базового (автоматически найденный)
    const shouldShowStatus = !apiUrl.includes(':5007');

    if (shouldShowStatus) {
        return (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-xs">API: {apiUrl.replace('http://localhost:', ':')}</span>
                </div>
            </div>
        );
    }

    return null;
};

export default ConnectionStatus;
