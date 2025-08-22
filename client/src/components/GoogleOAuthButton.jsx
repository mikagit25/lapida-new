import React from 'react';

const GoogleOAuthButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    style={{ marginBottom: '12px' }}
  >
    <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2" aria-hidden="true">
      <g>
        <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.29 2.97l6.18-6.18C34.88 2.61 29.87 0 24 0 14.61 0 6.41 5.74 2.44 14.09l7.61 5.92C12.13 14.09 17.62 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.09 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.91-2.18 5.38-4.65 7.04l7.23 5.62C43.99 37.09 46.09 31.27 46.09 24.5z"/>
        <path fill="#FBBC05" d="M10.05 28.01c-1.13-3.36-1.13-6.97 0-10.33l-7.61-5.92C.89 15.61 0 19.67 0 24c0 4.33.89 8.39 2.44 12.24l7.61-5.92z"/>
        <path fill="#EA4335" d="M24 46c5.87 0 10.88-1.94 14.91-5.29l-7.23-5.62c-2.01 1.35-4.59 2.15-7.68 2.15-6.38 0-11.87-4.59-13.95-10.84l-7.61 5.92C6.41 42.26 14.61 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </g>
    </svg>
    Зарегистрироваться через Google
  </button>
);

export default GoogleOAuthButton;
