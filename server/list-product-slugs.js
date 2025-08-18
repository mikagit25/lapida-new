const mongoose = require('mongoose');
const Product = require('./models/Product');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/lapida_db');
  const products = await Product.find({}, { _id: 1, slug: 1, name: 1 });
  for (const product of products) {
    console.log(`_id: ${product._id}, name: ${product.name}, slug: ${product.slug}`);
  }
  mongoose.disconnect();
}

main();
