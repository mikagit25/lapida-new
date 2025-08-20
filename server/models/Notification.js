const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  type: { type: String }, // order-status, etc.
  message: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ companyId: 1 });
NotificationSchema.index({ orderId: 1 });
NotificationSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Notification', NotificationSchema);
