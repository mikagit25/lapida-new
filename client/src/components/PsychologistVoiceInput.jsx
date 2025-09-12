/**
 * Компонент голосового ввода для AI-психолога (Web Speech API)
 * Не подключён к основному приложению, использовать только после тестирования!
 */
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const PsychologistVoiceInput = ({ onResult, disabled }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
  alert(t('voice_not_supported'));
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult && onResult(text);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopRecognition = () => {
    recognitionRef.current && recognitionRef.current.stop();
    setListening(false);
  };

  return (
    <button
      className={`px-4 py-2 rounded ${listening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} ml-2`}
      onClick={listening ? stopRecognition : startRecognition}
      disabled={disabled}
      type="button"
    >
  {listening ? t('stop') : t('voice_input')}
    </button>
  );
};

export default PsychologistVoiceInput;
