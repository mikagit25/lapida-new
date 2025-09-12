/**
 * Демонстрационная страница для тестирования голосового ввода/вывода AI-психолога
 * Не подключена к основному приложению!
 */
import React, { useState } from 'react';
import PsychologistVoiceInput from './PsychologistVoiceInput';
import PsychologistVoiceOutput from './PsychologistVoiceOutput';
import { useTranslation } from 'react-i18next';

const PsychologistVoiceDemo = () => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState(t('voice_demo_default_output'));

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('voice_demo_title')}</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">{t('voice_demo_input_label')}</label>
        <div className="flex items-center">
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={t('voice_demo_input_placeholder')}
          />
          <PsychologistVoiceInput onResult={setInputText} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">{t('voice_demo_output_label')}</label>
        <div className="flex items-center">
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={outputText}
            onChange={e => setOutputText(e.target.value)}
            placeholder={t('voice_demo_output_placeholder')}
          />
          <PsychologistVoiceOutput text={outputText} />
        </div>
      </div>
      <div className="text-gray-500 text-sm mt-6">
        <p>{t('voice_demo_note')}</p>
      </div>
    </div>
  );
};

export default PsychologistVoiceDemo;
