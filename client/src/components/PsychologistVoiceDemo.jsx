/**
 * Демонстрационная страница для тестирования голосового ввода/вывода AI-психолога
 * Не подключена к основному приложению!
 */
import React, { useState } from 'react';
import PsychologistVoiceInput from './PsychologistVoiceInput';
import PsychologistVoiceOutput from './PsychologistVoiceOutput';

const PsychologistVoiceDemo = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('Привет! Я ваш AI-психолог. Чем могу помочь?');

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Тест голосового ввода/вывода</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Голосовой ввод:</label>
        <div className="flex items-center">
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Скажите или введите текст..."
          />
          <PsychologistVoiceInput onResult={setInputText} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Голосовой вывод:</label>
        <div className="flex items-center">
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={outputText}
            onChange={e => setOutputText(e.target.value)}
            placeholder="Текст для озвучки..."
          />
          <PsychologistVoiceOutput text={outputText} />
        </div>
      </div>
      <div className="text-gray-500 text-sm mt-6">
        <p>Эта страница предназначена только для тестирования голосовых модулей. Не подключена к основному приложению.</p>
      </div>
    </div>
  );
};

export default PsychologistVoiceDemo;
