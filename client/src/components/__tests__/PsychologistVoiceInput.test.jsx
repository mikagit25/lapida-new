import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PsychologistVoiceInput from '../PsychologistVoiceInput';

describe('PsychologistVoiceInput', () => {
  it('renders button and handles click', () => {
    const { getByRole } = render(<PsychologistVoiceInput />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // Тестируем только рендер и клик, без реального SpeechRecognition
  });
});
