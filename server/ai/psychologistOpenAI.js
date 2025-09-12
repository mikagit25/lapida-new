// Модуль интеграции с OpenAI для AI-психолога (тестовая версия)
const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function getPsychologistReply(messages, lang = 'ru') {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  // Формируем prompt для поддержки и эмпатии
  const systemPrompt = {
    role: 'system',
    content: `Ты — эмпатичный психолог-консультант. Помогай человеку пережить утрату, поддерживай, не давай медицинских советов, не заменяй врача. Отвечай на языке пользователя (${lang}).`
  };
  const chatMessages = [systemPrompt, ...messages.filter(m => m.role === 'user').map(m => ({ role: 'user', content: m.content }))];
  const body = {
    model: 'gpt-3.5-turbo',
    messages: chatMessages,
    temperature: 0.7,
    max_tokens: 400
  };
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('OpenAI API error: ' + res.status);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'Извините, не удалось получить ответ.';
}

module.exports = { getPsychologistReply };
