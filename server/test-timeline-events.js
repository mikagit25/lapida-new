// Быстрая проверка наличия событий таймлайна для любого мемориала
const mongoose = require('mongoose');
const TimelineEvent = require('./models/TimelineEvent');
const Memorial = require('./models/Memorial');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lapida';

async function main() {
  await mongoose.connect(MONGO_URI);
  const memorials = await Memorial.find({});
  if (!memorials.length) {
    console.log('Нет мемориалов в базе.');
    return;
  }
  for (const memorial of memorials) {
    const events = await TimelineEvent.find({ memorial: memorial._id });
    console.log(`Мемориал: ${memorial._id} (${memorial.firstName || ''} ${memorial.lastName || ''}) — событий: ${events.length}`);
    if (events.length) {
      events.forEach(ev => {
        console.log(`  - ${ev.title} | дата: ${ev.date ? ev.date.toISOString().slice(0,10) : 'нет'} | фото: ${ev.photos?.length || 0}`);
      });
    }
  }
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
