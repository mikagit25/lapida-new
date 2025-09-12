# Документация: Голосовые модули AI-психолога

## Назначение
Изолированные React-компоненты для голосового ввода и вывода в чате AI-психолога. Используют Web Speech API (браузерные технологии).

## Состав
- `PsychologistVoiceInput.jsx` — кнопка для голосового ввода (SpeechRecognition)
- `PsychologistVoiceOutput.jsx` — кнопка для голосового вывода (SpeechSynthesis)
- `PsychologistVoiceDemo.jsx` — демо-компонент для ручного тестирования
- `PsychologistVoiceTest.jsx` — отдельная страница для теста
- `__tests__/` — юнит-тесты для компонентов

## Использование
1. Импортировать компонент:
   ```js
   import PsychologistVoiceInput from './PsychologistVoiceInput';
   import PsychologistVoiceOutput from './PsychologistVoiceOutput';
   ```
2. Вставить в нужное место формы:
   ```jsx
   <PsychologistVoiceInput onResult={setInputText} />
   <PsychologistVoiceOutput text={outputText} />
   ```
3. Для ручного теста — открыть страницу `PsychologistVoiceTest.jsx` (НЕ подключена к App.jsx).

## Ограничения
- Работает только в современных браузерах (Chrome, Edge, частично Firefox).
- Не работает в Safari (iOS/macOS) и старых браузерах.
- Не подключено к основному приложению до полного тестирования.
- Нет поддержки серверного рендеринга.

## Пример сценария тестирования
1. Открыть страницу `PsychologistVoiceTest.jsx` в браузере.
2. Проверить работу голосового ввода (надиктовать текст).
3. Проверить работу голосового вывода (озвучить текст).
4. Проверить юнит-тесты (`__tests__`).

## Возможные доработки
- Добавить визуальную индикацию записи/воспроизведения.
- Поддержка нескольких языков.
- Обработка ошибок и edge-cases.
- Интеграция с App.jsx после полного тестирования.
