// Скрипт генерации sitemap.xml для Node.js (MongoDB)
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const BASE_URL = 'https://lapida.ru';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/lapida';
const DB_NAME = 'lapida';

async function main() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);

  const companies = await db.collection('companies').find({}, { projection: { customSlug: 1, updatedAt: 1 } }).toArray();
  const products = await db.collection('products').find({}, { projection: { slug: 1, updatedAt: 1 } }).toArray();

  const urls = [
    { loc: `${BASE_URL}/`, priority: 1.0, changefreq: 'daily' },
    { loc: `${BASE_URL}/companies`, priority: 0.9, changefreq: 'daily' },
    { loc: `${BASE_URL}/products`, priority: 0.9, changefreq: 'daily' },
    { loc: `${BASE_URL}/memorials`, priority: 0.8, changefreq: 'daily' },
    // Компании
    ...companies.map(c => ({
      loc: `${BASE_URL}/company/${c.customSlug}`,
      priority: 0.8,
      changefreq: 'weekly',
      lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString().slice(0, 10) : undefined
    })),
    // Товары
    ...products.map(p => ({
      loc: `${BASE_URL}/products/${p.slug}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : undefined
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u =>
      `  <url>\n` +
      `    <loc>${u.loc}</loc>\n` +
      (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '') +
      `    <changefreq>${u.changefreq}</changefreq>\n` +
      `    <priority>${u.priority}</priority>\n` +
      `  </url>`
    ).join('\n') +
    '\n</urlset>\n';

  const outPath = path.join(__dirname, '../client/public/sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('Sitemap generated:', outPath);
  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
