import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Получаем токен из query-параметра
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      // Сохраняем токен и делаем запрос к /api/users/me
      localStorage.setItem('authToken', token);
      login({ token })
        .then(() => navigate('/'))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [login, navigate]);

  return <div>Вход через Google... Пожалуйста, подождите.</div>;
}
