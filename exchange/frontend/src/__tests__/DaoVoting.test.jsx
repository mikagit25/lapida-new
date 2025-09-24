import React from 'react';
import { render, screen } from '@testing-library/react';
import DaoVoting from '../components/DaoVoting';

test('renders DAO voting UI', () => {
  render(<DaoVoting />);
  expect(screen.getByText(/DAO \/ Голосование/i)).toBeInTheDocument();
  expect(screen.getByText(/За/i)).toBeInTheDocument();
  expect(screen.getByText(/Против/i)).toBeInTheDocument();
});
