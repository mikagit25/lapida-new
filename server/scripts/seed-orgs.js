/* Seed demo organizations and services for ritual orgs refactor */
const mongoose = require('mongoose');
const ReligiousOrganization = require('../models/ReligiousOrganization');
const ReligiousService = require('../models/ReligiousService');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db';

const orgs = [
  {
    name: 'Светлая Память',
    slug: 'svetлая-pamyat',
    confession: 'orthodox',
    description: 'Полный комплекс ритуальных услуг и поддержка 24/7.',
    contacts: {
      phones: [{ label: 'Основной', value: '+79991234567' }],
      email: 'info@svetpamyat.ru',
      website: 'https://svetpamyat.ru',
      messengers: { telegram: '@svetpamyat' },
      address: { city: 'Москва', street: 'ул. Памятная 10' }
    },
    serviceAreas: [{ city: 'Москва', radiusKm: 50 }],
    media: { logo: 'https://placehold.co/200x200' },
    hasEmergency: true,
    is24x7: true,
    isPublic: true
  },
  {
    name: 'Ритуал-Сервис',
    slug: 'ritual-service',
    confession: 'orthodox',
    description: 'Организация похорон и кремации, помощь в документах.',
    contacts: {
      phones: [{ label: 'Оперативный', value: '+79997654321' }],
      email: 'help@ritual-service.ru',
      address: { city: 'Санкт-Петербург', street: 'Набережная 5' }
    },
    serviceAreas: [{ city: 'Санкт-Петербург', radiusKm: 70 }],
    media: { logo: 'https://placehold.co/200x200' },
    hasEmergency: true,
    is24x7: true,
    isPublic: true
  }
];

const services = {
  'svetлая-pamyat': [
    { name: 'Организация похорон', category: 'base', priceMin: 30000, priceMax: 80000, isEmergency: true },
    { name: 'Кремация', category: 'cremation', priceMin: 25000, priceMax: 60000 },
    { name: 'Перевозка', category: 'transport', priceMin: 5000, priceMax: 20000, isEmergency: true },
  ],
  'ritual-service': [
    { name: 'Организация похорон', category: 'base', priceMin: 28000, priceMax: 75000, isEmergency: true },
    { name: 'Цветы и венки', category: 'flowers', priceMin: 3000, priceMax: 15000 },
    { name: 'Кремация', category: 'cremation', priceMin: 23000, priceMax: 55000 },
  ]
};

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to Mongo');

  for (const org of orgs) {
    const existing = await ReligiousOrganization.findOne({ slug: org.slug });
    const savedOrg = existing || await ReligiousOrganization.create({ ...org, owner: org.owner || new mongoose.Types.ObjectId() });
    console.log(`Org ready: ${savedOrg.slug}`);

    const svcList = services[org.slug] || [];
    for (const svc of svcList) {
      const exists = await ReligiousService.findOne({ organization: savedOrg._id, name: svc.name });
      if (!exists) {
        await ReligiousService.create({ ...svc, organization: savedOrg._id });
        console.log(`  added service: ${svc.name}`);
      }
    }
  }

  console.log('Done');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
