import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api.js';

// Создаем контекст
const AuthContext = createContext();

// Начальное состояние
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer для управления состоянием
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOGIN_SUCCESS':
      // Сохраняем пользователя и токен в localStorage
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('token', action.payload.token);
      }
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        ...initialState,
        isLoading: false,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userRaw = localStorage.getItem('user');
      let userParsed = null;
      try {
        userParsed = userRaw ? JSON.parse(userRaw) : null;
      } catch (e) {
        userParsed = null;
      }
      console.log('[AuthProvider] user из localStorage:', userParsed);
      if (token && userParsed) {
        try {
          // Проверяем действительность токена только если он есть
          const response = await authService.verifyToken();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token,
              user: userParsed,
            },
          });
        } catch (error) {
          // Токен недействителен
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    console.log('[AuthProvider] user из состояния:', state.user);
  }, [state.user]);

  // Функция входа
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ошибка входа';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Функция регистрации
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.register(userData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ошибка регистрации';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Функция выхода
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Обновление профиля пользователя
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      // Сохраняем пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      dispatch({
        type: 'UPDATE_USER',
        payload: response.user,
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ошибка обновления профиля';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Очистка ошибки
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Обновление данных пользователя в состоянии
  const updateUser = (userData) => {
    // Сохраняем пользователя в localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    });
  };

  // Значения контекста
  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
