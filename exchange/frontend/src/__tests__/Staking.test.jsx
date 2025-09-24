import React from 'react';
import { render, screen } from '@testing-library/react';
import Staking from '../components/Staking';

test('renders staking UI', () => {
  render(<Staking />);
  expect(screen.getByText(/Стейкинг стейблкоинов\/LPD/i)).toBeInTheDocument();
  expect(screen.getByText(/Стейкать/i)).toBeInTheDocument();
});
