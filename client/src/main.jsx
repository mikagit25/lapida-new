import './index.css';
import './App.css';


import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { getApiBaseUrl } from './config/api';

// Дожидаемся определения API_BASE_URL перед стартом приложения
getApiBaseUrl().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  );
});
