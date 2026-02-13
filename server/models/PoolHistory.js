const mongoose = require('mongoose');

const poolHistorySchema = new mongoose.Schema({
  type: { type: String, enum: ['liquidity', 'exchange', 'staking'], required: true },
  action: { type: String, trim: true }, // e.g., add/remove/claim
  wallet: { type: String, required: true, trim: true },
  amountA: { type: Number },
  amountB: { type: Number },
  stablecoin: { type: String, trim: true },
  amount: { type: Number }, // generic amount (e.g., exchange amount)
  amountIn: { type: Number },
  amountOut: { type: Number },
  reward: { type: Number },
  mlpd: { type: Number },
  tokenIn: { type: String, trim: true },
  tokenOut: { type: String, trim: true },
  price: { type: Number },
  txHash: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

poolHistorySchema.index({ type: 1, timestamp: -1 });
poolHistorySchema.index({ wallet: 1, timestamp: -1 });

module.exports = mongoose.model('PoolHistory', poolHistorySchema);
