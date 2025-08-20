// Скрипт для интеграции всех компаний и товаров в EspoCRM
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Company = require('./models/Company');
const Product = require('./models/Product');

const CRM_API_URL = 'http://localhost:8081/api/v1';
const API_KEY = 'b1cdd8cfc24c3e9b1f4a852a1220d6bd';
const AUTH_HEADERS = { headers: { 'X-Api-Key': API_KEY } };

async function sync() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lapida', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const companies = await Company.find({});
  console.log(`Найдено компаний: ${companies.length}`);

// CRM integration removed
}

sync();
