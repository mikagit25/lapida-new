/* eslint-env jest */
/* global describe, it, expect */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PsychologistVoiceOutput from '../PsychologistVoiceOutput';

describe('PsychologistVoiceOutput', () => {
  it('renders button and handles click', () => {
    const { getByRole } = render(<PsychologistVoiceOutput text="Тест" />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // Тестируем только рендер и клик, без реального speechSynthesis
  });
});
