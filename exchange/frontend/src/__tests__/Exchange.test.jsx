import React from 'react';
import { render, screen } from '@testing-library/react';
import Exchange from '../components/Exchange';

test('renders exchange UI', () => {
  render(<Exchange />);
  expect(screen.getByText(/Обмен стейблкоинов на LPD/i)).toBeInTheDocument();
  expect(screen.getByText(/Подключить кошелек/i)).toBeInTheDocument();
  expect(screen.getByText(/Обменять на LPD/i)).toBeInTheDocument();
});
