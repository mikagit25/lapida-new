const mongoose = require('mongoose');
const Memorial = require('./models/Memorial');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lapida';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const broken = await Memorial.find({
    $or: [
      { firstName: { $in: [null, '', undefined] } },
      { lastName: { $in: [null, '', undefined] } },
      { birthDate: { $in: [null, '', undefined] } },
      { deathDate: { $in: [null, '', undefined] } }
    ]
  });
  console.log('Некорректные мемориалы:', broken);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
