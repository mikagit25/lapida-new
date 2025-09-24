import React from 'react';
import { render, screen } from '@testing-library/react';
import LiquidityPool from '../components/LiquidityPool';

test('renders liquidity pool UI', () => {
  render(<LiquidityPool />);
  expect(screen.getByText(/Пул ликвидности/i)).toBeInTheDocument();
  expect(screen.getByText(/Добавить ликвидность/i)).toBeInTheDocument();
  expect(screen.getByText(/Удалить ликвидность/i)).toBeInTheDocument();
});
