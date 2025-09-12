const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
let openai = null;
let openaiEnabled = false;
try {
  const { OpenAI } = require('openai');
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    openaiEnabled = true;
  }
} catch (e) {
  openaiEnabled = false;
}

// POST /api/psychologist/chat
router.post('/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message required' });

    // Найти или создать сессию
    let session = await ChatSession.findOne({ sessionId });
    if (!session) session = new ChatSession({ sessionId, messages: [] });

    // Добавить сообщение пользователя
    session.messages.push({ role: 'user', content: message, ts: new Date() });

    // Сформировать prompt (последние 10 сообщений)
    const history = session.messages.slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.content }));

    // Запрос к OpenAI
    let aiReply = '';
    if (openaiEnabled) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: history,
          max_tokens: 512,
          temperature: 0.7,
        });
        aiReply = completion.choices[0].message.content;
      } catch (err) {
        const lastUser = message;
        aiReply = `Я понимаю ваши чувства. Спасибо, что поделились: "${lastUser}". Если хотите, расскажите подробнее — я готов выслушать.`;
      }
    } else {
      const lastUser = message;
      aiReply = `Я понимаю ваши чувства. Спасибо, что поделились: "${lastUser}". Если хотите, расскажите подробнее — я готов выслушать.`;
    }

    // Сохранить ответ AI
    session.messages.push({ role: 'ai', content: aiReply, ts: new Date() });
    await session.save();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

module.exports = router;
