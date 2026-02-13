const express = require('express');
const router = express.Router();
const PoolHistory = require('../models/PoolHistory');
const { validate, poolExchangeSchema, poolStakingSchema } = require('../middleware/validation');

// Buy token endpoint -> сохраняем обмен (stablecoin -> LPD)
router.post('/buy', validate(poolExchangeSchema), async (req, res) => {
  try {
    const { wallet, stablecoin = 'USDT', amount, tokenAmount, price, txHash, timestamp } = req.body;

    const entry = await PoolHistory.create({
      type: 'exchange',
      action: 'buy',
      wallet,
      stablecoin,
      amount, // stablecoin in
      amountIn: amount,
      amountOut: tokenAmount,
      tokenIn: stablecoin,
      tokenOut: 'LPD',
      price,
      txHash,
      timestamp: timestamp || Date.now()
    });

    res.status(201).json({ status: 'success', entry });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ошибка покупки токена', error: error.message });
  }
});

// Swap token endpoint -> сохраняем обмен токенов
router.post('/swap', validate(poolExchangeSchema), async (req, res) => {
  try {
    const { wallet, fromToken, toToken, amountIn, amountOut, price, txHash, timestamp } = req.body;

    const entry = await PoolHistory.create({
      type: 'exchange',
      action: 'swap',
      wallet,
      stablecoin: fromToken,
      amount: amountIn,
      amountIn,
      amountOut,
      tokenIn: fromToken,
      tokenOut: toToken,
      price,
      txHash,
      timestamp: timestamp || Date.now()
    });

    res.status(201).json({ status: 'success', entry });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ошибка свопа', error: error.message });
  }
});

// Stake token endpoint (создаём запись стейкинга в истории)
router.post('/stake', validate(poolStakingSchema), async (req, res) => {
  try {
    const { wallet, amount, txHash, mlpd, timestamp } = req.body;

    const entry = await PoolHistory.create({
      type: 'staking',
      wallet,
      amount,
      mlpd,
      txHash,
      timestamp: timestamp || Date.now()
    });

    res.status(201).json({ status: 'success', entry });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ошибка стейкинга', error: error.message });
  }
});

// Analytics endpoint (агрегации по историям)
router.get('/analytics', async (req, res) => {
  try {
    const [liquidityAgg, exchangeAgg, stakingAgg] = await Promise.all([
      PoolHistory.aggregate([
        { $match: { type: 'liquidity' } },
        { $group: { _id: null, totalA: { $sum: '$amountA' }, totalB: { $sum: '$amountB' }, count: { $sum: 1 } } }
      ]),
      PoolHistory.aggregate([
        { $match: { type: 'exchange' } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' }, totalIn: { $sum: '$amountIn' }, totalOut: { $sum: '$amountOut' }, count: { $sum: 1 } } }
      ]),
      PoolHistory.aggregate([
        { $match: { type: 'staking' } },
        { $group: { _id: null, totalStaked: { $sum: '$amount' }, totalRewards: { $sum: '$mlpd' }, count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      stats: {
        liquidity: liquidityAgg[0] || { totalA: 0, totalB: 0, count: 0 },
        exchange: exchangeAgg[0] || { totalAmount: 0, totalIn: 0, totalOut: 0, count: 0 },
        staking: stakingAgg[0] || { totalStaked: 0, totalRewards: 0, count: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка аналитики токена', error: error.message });
  }
});

module.exports = router;
