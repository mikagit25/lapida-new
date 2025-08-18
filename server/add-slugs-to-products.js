const mongoose = require('mongoose');
const Product = require('./models/Product');

const slugify = (str) => {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

async function main() {
  await mongoose.connect('mongodb://localhost:27017/lapida_db');
  const products = await Product.find({});
  for (const product of products) {
    if (!product.slug) {
      product.slug = slugify(product.name + '-' + product._id.toString().slice(-6));
      await product.save();
      console.log(`Добавлен slug для товара: ${product.name} -> ${product.slug}`);
    }
  }
  console.log('Готово!');
  mongoose.disconnect();
}

main();
