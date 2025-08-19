import { AuthProvider, useAuth } from './context/AuthContext';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// ...existing code...
import Login from './pages/Login';
import Register from './pages/Register';
import MemorialCreate from './pages/MemorialCreate';
import MemorialView from './pages/MemorialView';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import TestPhotoComments from './pages/TestPhotoComments';
import PersonalCabinet from './components/PersonalCabinet';
import MobileNavigation from './components/MobileNavigation';
import NotificationBell from './components/NotificationBell';
import Search from './components/Search';
import { newMemorialService } from './services/api';
import { fixImageUrl } from './utils/imageUrl';
import Companies from './pages/Companies';
import CompanyPage from './pages/CompanyPage';
import Business from './pages/Business';
import RegisterCompany from './pages/RegisterCompany';
import CompanyOrdersPage from './orders/CompanyOrdersPage';
import ClientOrdersPage from './orders/ClientOrdersPage';
import CompanyCabinet from './pages/CompanyCabinet';
import ProductPage from './pages/ProductPage';
import Products from './pages/Products';
import CompanyProfile from './pages/CompanyProfile';

// Асинхронный компонент для загрузки изображения
function AsyncImage({ url, alt, className, onError }) {
  const [imgUrl, setImgUrl] = React.useState('');
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!url) {
        if (isMounted) setImgUrl('');
        return;
      }
      const fixed = await fixImageUrl(url);
      if (isMounted) setImgUrl(fixed);
    })();
    return () => { isMounted = false; };
  }, [url]);
  if (!imgUrl) return null;
  return <img src={imgUrl} alt={alt} className={className} onError={onError} />;
}

// Навигация с аутентификацией
const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (user?.avatar) {
      console.log('user.avatar:', user.avatar);
    }
  }, [user]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-xl font-bold text-gray-900">
              Lapida
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Главная
              </Link>
              {isAuthenticated && (
                <Link to="/cabinet" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium font-semibold">
                  Личный кабинет
                </Link>
              )}
              <Link to="/memorials" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Мемориалы
              </Link>
              <Link to="/companies" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Компании
              </Link>
              <Link to="/business" className="text-blue-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium font-semibold">
                Для бизнеса
              </Link>
              <Link to="/products" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Товары
              </Link>
            </div>
          </div>

          {/* Поисковая строка */}
          <div className="hidden md:flex flex-1 justify-center px-6 lg:px-8">
            <div className="max-w-lg w-full">
              <Search className="w-full" placeholder="Поиск мемориалов..." />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                {/* Аватар возле имени (асинхронный компонент) */}
                {user?.avatar ? (
                  <AsyncImage
                    url={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <span className="text-gray-700">Привет, {user?.name}</span>
                <Link to="/create-memorial" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Создать мемориал
                </Link>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Войти
                </Link>
                <Link to="/register" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Главная страница
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Lapida
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Цифровая платформа для создания и поддержания памяти о близких людях
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
            <Link to="/memorials" className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              Просмотреть мемориалы
            </Link>
            {isAuthenticated ? (
              <Link to="/create-memorial" className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10">
                Создать мемориал
              </Link>
            ) : (
              <Link to="/register" className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10">
                Зарегистрироваться
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Страница мемориалов
const Memorials = () => {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadMemorials();
  }, []);

  const loadMemorials = async () => {
    try {
      setLoading(true);
      const data = await newMemorialService.getAll();
      setMemorials(data);
    } catch (error) {
      console.error('Error loading memorials:', error);
      setError('Ошибка при загрузке мемориалов');
    } finally {
      setLoading(false);
    }
  };

  const filteredMemorials = memorials.filter(memorial =>
    memorial.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMemorials = [...filteredMemorials].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка мемориалов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Мемориалы</h1>
          <p className="text-gray-600 mb-6">
            Сохраните память о близких и поделитесь их историями
          </p>

          {/* Поиск и фильтры */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="name">По имени</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {sortedMemorials.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Мемориалы не найдены' : 'Пока нет мемориалов'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос' 
                : 'Станьте первым, кто создаст мемориал'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/create-memorial"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Создать мемориал
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMemorials.map((memorial) => (
              <div key={memorial._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  {memorial.profileImage ? (
                    <AsyncImage
                      url={memorial.profileImage}
                      alt={memorial.fullName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.error('Ошибка загрузки изображения:', memorial.profileImage);
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-48 bg-gray-200 flex items-center justify-center ${memorial.profileImage ? 'hidden' : ''}`}>
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white text-lg font-semibold">{memorial.fullName}</h3>
                    <p className="text-white text-sm opacity-90">{memorial.lifespan}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  {memorial.epitaph && (
                    <blockquote className="text-gray-700 italic text-sm mb-3 line-clamp-2">
                      "{memorial.epitaph}"
                    </blockquote>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Просмотров: {memorial.views || 0}</span>
                    <span>{new Date(memorial.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  
                  <Link
                    to={memorial.customSlug ? `/memorial/${memorial.customSlug}` : `/memorial/${memorial.shareUrl}`}
                    className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block"
                  >
                    Посетить мемориал
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Страница не найдена</h1>
        <p className="text-gray-600">Проверьте адрес или воспользуйтесь навигацией выше.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">На главную</Link>
      </div>
    </div>
  );
  const { user } = useAuth();
  console.log('App.jsx user:', user);
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="pb-16 lg:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cabinet" element={<PrivateRoute><PersonalCabinet /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/memorials" element={<Memorials />} />
              <Route path="/memorial/:shareUrl" element={<MemorialView />} />
              <Route path="/memorial/:slug" element={<MemorialView />} />
              <Route path="/test-comments" element={<TestPhotoComments />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/create-memorial" element={<PrivateRoute><MemorialCreate /></PrivateRoute>} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:id" element={<CompanyPage />} />
              <Route path="/companies/:id/cabinet" element={<CompanyCabinet />} />
              <Route path="/company-orders/:companyId" element={<PrivateRoute><CompanyOrdersPage /></PrivateRoute>} />
              <Route path="/my-orders" element={<PrivateRoute><ClientOrdersPage /></PrivateRoute>} />
              <Route path="/business" element={<Business />} />
              <Route path="/register-company" element={<RegisterCompany />} />
              <Route path="/company-cabinet/:id" element={<CompanyCabinet />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/company/:companySlug" element={<CompanyProfileBySlug />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <MobileNavigation />
        </div>
      </Router>
    </AuthProvider>
  );
};

// Компонент для поиска компании по customSlug
function CompanyProfileBySlug() {
  const { companySlug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/companies/by-slug/${companySlug}`)
      .then(res => res.json())
      .then(data => {
        setCompany(data.company);
        setLoading(false);
      })
      .catch(() => {
        setError('Компания не найдена');
        setLoading(false);
      });
  }, [companySlug]);

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error || !company) return <div className="p-8 text-red-600">{error || 'Компания не найдена'}</div>;

  // Исправляем ссылки на компанию: используем короткий slug, но с префиксом /company/
  return <CompanyProfile company={company} userData={user} />;
}

export default App;
