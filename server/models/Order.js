const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  name: String,
  phone: String,
  address: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
    }
  ],
  status: { type: String, enum: ['new', 'pending', 'confirmed', 'shipped', 'completed', 'cancelled'], default: 'new' },
  comment: String,
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  history: [
    {
      status: String,
      date: { type: Date, default: Date.now },
      comment: String
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.index({ userId: 1 });
OrderSchema.index({ companyId: 1 });
OrderSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Order', OrderSchema);
