import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Lapida
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Мемориальная платформа для сохранения памяти
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link
              to="/memorials"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Просмотреть мемориалы
            </Link>
            
            {!isAuthenticated && (
              <>
                <Link
                  to="/register"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Регистрация
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Войти
                </Link>
              </>
            )}
            
            {isAuthenticated && (
              <Link
                to="/create-memorial"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Создать мемориал
              </Link>
            )}
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Сохраните память
            </h3>
            <p className="text-gray-600">
              Создайте мемориальную страницу для ваших близких с фотографиями, историями и воспоминаниями.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Поделитесь историями
            </h3>
            <p className="text-gray-600">
              Приглашайте родных и друзей делиться воспоминаниями и создавать общую историю жизни.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Вечная память
            </h3>
            <p className="text-gray-600">
              Ваши воспоминания будут храниться безопасно и доступны для будущих поколений.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
