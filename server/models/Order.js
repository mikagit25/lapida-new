const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  comment: String,
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
