

import { Buffer } from 'buffer';
window.Buffer = Buffer;
globalThis.Buffer = Buffer;
import './index.css';
import './App.css';
import './i18n';


import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { API_BASE_URL } from './config/api';

// Старт приложения с универсальным API_BASE_URL
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
