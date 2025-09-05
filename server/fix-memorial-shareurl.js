// Скрипт для массового обновления shareUrl у мемориалов
// Запускать: node fix-memorial-shareurl.js

const mongoose = require('mongoose');
const Memorial = require('./models/Memorial');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lapida_db';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const memorials = await Memorial.find({});
  let updated = 0;

  for (const m of memorials) {
    if (m.shareUrl && /-\d{13,}$/.test(m.shareUrl)) {
      // Удаляем числовой хвост
      const newShareUrl = m.shareUrl.replace(/-\d{13,}$/, '');
      // Проверяем, не занят ли такой shareUrl
      const exists = await Memorial.findOne({ shareUrl: newShareUrl, _id: { $ne: m._id } });
      if (!exists) {
        m.shareUrl = newShareUrl;
        await m.save();
        updated++;
        console.log(`Обновлено: ${m._id} -> ${newShareUrl}`);
      } else {
        console.log(`Пропущено (дубликат): ${m._id} -> ${newShareUrl}`);
      }
    }
  }
  console.log(`Готово. Обновлено мемориалов: ${updated}`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
