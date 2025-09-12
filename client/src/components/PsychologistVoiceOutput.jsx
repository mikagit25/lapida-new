/**
 * Компонент голосового вывода для AI-психолога (Web Speech Synthesis API)
 * Не подключён к основному приложению, использовать только после тестирования!
 */
import React, { useState } from 'react';

const PsychologistVoiceOutput = ({ text, lang = 'ru-RU', disabled }) => {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Ваш браузер не поддерживает озвучку');
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <button
      className={`px-4 py-2 rounded ${speaking ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} ml-2`}
      onClick={speaking ? stop : speak}
      disabled={disabled || !text}
      type="button"
    >
      {speaking ? 'Стоп' : 'Озвучить'}
    </button>
  );
};

export default PsychologistVoiceOutput;
