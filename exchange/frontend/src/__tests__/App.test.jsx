import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders navigation buttons', () => {
  render(<App />);
  expect(screen.getByText(/Обмен/i)).toBeInTheDocument();
  expect(screen.getByText(/Дашборд/i)).toBeInTheDocument();
  expect(screen.getByText(/DAO/i)).toBeInTheDocument();
  expect(screen.getByText(/Whitepaper/i)).toBeInTheDocument();
  expect(screen.getByText(/Токеномика/i)).toBeInTheDocument();
  expect(screen.getByText(/Команда/i)).toBeInTheDocument();
  expect(screen.getByText(/FAQ/i)).toBeInTheDocument();
  expect(screen.getByText(/Поддержка/i)).toBeInTheDocument();
});
