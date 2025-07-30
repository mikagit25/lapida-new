import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 text-xl font-bold text-gray-900">
                  Lapida - Test
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<div><h1>Главная страница</h1><p>Тестовая версия приложения</p></div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
