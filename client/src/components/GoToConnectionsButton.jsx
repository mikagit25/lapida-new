import React from 'react';
import { Link } from 'react-router-dom';

const GoToConnectionsButton = () => (
  <Link
    to="/connections"
    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    style={{ marginTop: '12px', marginBottom: '12px' }}
  >
    <span style={{ fontSize: '1.2em', marginRight: '8px' }}>👥</span>
    Мои друзья и родственники
  </Link>
);

export default GoToConnectionsButton;
