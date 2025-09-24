import React from 'react';
import { render, screen } from '@testing-library/react';
import UserDashboard from '../components/UserDashboard';

test('renders user dashboard UI', () => {
  render(<UserDashboard provider={null} />);
  expect(screen.getByText(/Дашборд пользователя/i)).toBeInTheDocument();
  expect(screen.getByText(/Кошелек:/i)).toBeInTheDocument();
});
