import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fixImageUrl } from '../utils/imageUrl';
import Search from './Search';

const MobileNavigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', label: 'Главная', icon: '🏠', public: true },
    { path: '/companies', label: 'Компании', icon: '🏢', public: true },
    { path: '/products', label: 'Товары', icon: '�', public: true },
    { path: '/memorials', label: 'Мемориалы', icon: '🏛️', public: true },
    { path: '/dashboard', label: 'Дашборд', icon: '📊', auth: true },
    { path: '/create-memorial', label: 'Создать мемориал', icon: '➕', auth: true },
    { path: '/profile', label: 'Профиль', icon: '👤', auth: true },
  ];

  const visibleItems = navigationItems.filter(item => 
    item.public || (item.auth && isAuthenticated)
  );

  return (
    <>
      {/* Мобильная навигация */}
      <nav className="lg:hidden bg-white shadow-lg border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-around items-center py-2">
          {visibleItems.slice(0, 3).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActivePath(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Кнопка поиска */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          >
            <span className="text-lg mb-1">🔍</span>
            <span className="text-xs font-medium">Поиск</span>
          </button>

          {visibleItems.slice(3, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActivePath(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          
          {isAuthenticated && (
            <button
              onClick={toggleMenu}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isMenuOpen
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg mb-1">⋯</span>
              <span className="text-xs font-medium">Меню</span>
            </button>
          )}
        </div>
      </nav>

      {/* Выпадающее меню */}
      {isMenuOpen && isAuthenticated && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={closeMenu}>
          <div className="absolute bottom-16 right-4 bg-white rounded-lg shadow-xl p-4 min-w-[200px]">
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              {user.photo && (
                <img
                  src={fixImageUrl(user.photo)}
                  alt="Фото профиля"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="py-2">
              <Link
                to="/profile"
                onClick={closeMenu}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>👤</span>
                <span>Профиль</span>
              </Link>
              
              <Link
                to="/profile?tab=preferences"
                onClick={closeMenu}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>⚙️</span>
                <span>Настройки</span>
              </Link>
              
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <span>🚪</span>
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Отступ для фиксированной навигации */}
      <div className="lg:hidden h-16"></div>

      {/* Полноэкранный поиск для мобильных */}
      {isSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Поиск</h2>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <Search 
              className="w-full" 
              placeholder="Поиск мемориалов..." 
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
