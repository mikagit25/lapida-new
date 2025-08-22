const mongoose = require('mongoose');
const Page = require('./models/Page');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
  const page = new Page({
    path: '/test',
    title: 'Тестовая страница',
    content: 'Контент для теста',
    isHidden: false
  });
  await page.save();
  console.log('Тестовая страница создана:', page);
  await mongoose.disconnect();
}

main().catch(console.error);
