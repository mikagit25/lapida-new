const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const PoolHistory = require('../models/PoolHistory');
const { validate, validateQuery, poolLiquiditySchema, poolExchangeSchema, poolStakingSchema, poolHistoryQuerySchema } = require('../middleware/validation');

// Получить общую информацию о пуле ликвидности (агрегация по истории)
router.get('/pool/info', async (req, res) => {
  try {
    const { wallet } = req.query;

    const [liquidityAgg, stakingAgg, userLiquidityAgg, userStakingAgg] = await Promise.all([
      PoolHistory.aggregate([
        { $match: { type: 'liquidity' } },
        { $group: { _id: null, totalA: { $sum: '$amountA' }, totalB: { $sum: '$amountB' }, count: { $sum: 1 } } }
      ]),
      PoolHistory.aggregate([
        { $match: { type: 'staking' } },
        { $group: { _id: null, totalStaked: { $sum: '$amount' }, totalRewards: { $sum: '$mlpd' }, count: { $sum: 1 } } }
      ]),
      wallet ? PoolHistory.aggregate([
        { $match: { type: 'liquidity', wallet } },
        { $group: { _id: null, totalA: { $sum: '$amountA' }, totalB: { $sum: '$amountB' }, count: { $sum: 1 } } }
      ]) : [],
      wallet ? PoolHistory.aggregate([
        { $match: { type: 'staking', wallet } },
        { $group: { _id: null, totalStaked: { $sum: '$amount' }, totalRewards: { $sum: '$mlpd' }, count: { $sum: 1 } } }
      ]) : []
    ]);

    const liq = liquidityAgg[0] || { totalA: 0, totalB: 0, count: 0 };
    const stk = stakingAgg[0] || { totalStaked: 0, totalRewards: 0, count: 0 };
    const userLiq = userLiquidityAgg[0] || { totalA: 0, totalB: 0, count: 0 };
    const userStk = userStakingAgg[0] || { totalStaked: 0, totalRewards: 0, count: 0 };

    res.json({
      pool: {
        tokenA: 'LPD',
        tokenB: 'USDT',
        rewardToken: 'MLPD',
        apy: 0,
        totalLiquidityOps: liq.count,
        totalLiquidityA: liq.totalA || 0,
        totalLiquidityB: liq.totalB || 0,
        totalStakingOps: stk.count,
        totalStaked: stk.totalStaked || 0,
        totalRewards: stk.totalRewards || 0,
        userLiquidityOps: userLiq.count,
        userLiquidityA: userLiq.totalA || 0,
        userLiquidityB: userLiq.totalB || 0,
        userStakingOps: userStk.count,
        userStaked: userStk.totalStaked || 0,
        userRewards: userStk.totalRewards || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения информации о пуле', error: error.message });
  }
});

// История операций пула (все типы) с фильтрами
router.get('/pool/history', validateQuery(poolHistoryQuerySchema), async (req, res) => {
  try {
    const { limit = 100, skip = 0, type, wallet, from, to, cursorTs, cursorId } = req.query;
    const limitNum = Math.min(Number(limit), 500);
    const skipNum = Number(skip);
    const filter = {};
    if (type) filter.type = type;
    if (wallet) filter.wallet = wallet;
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }

    // Cursor-based pagination fallback (timestamp + _id for stable ordering)
    if (cursorTs || cursorId) {
      const tsDate = cursorTs ? new Date(cursorTs) : null;
      const oid = cursorId ? new mongoose.Types.ObjectId(cursorId) : null;
      filter.$or = [];
      if (tsDate) {
        filter.$or.push({ timestamp: { $lt: tsDate } });
      }
      if (tsDate && oid) {
        filter.$or.push({ timestamp: tsDate, _id: { $lt: oid } });
      }
      if (!filter.$or.length && oid) {
        filter._id = { $lt: oid };
        delete filter.$or;
      }
      if (filter.$or && !filter.$or.length) delete filter.$or;
    }

    const sort = { timestamp: -1, _id: -1 };
    const [total, history] = await Promise.all([
      PoolHistory.countDocuments(filter),
      PoolHistory.find(filter)
        .sort(sort)
        .skip(cursorTs || cursorId ? 0 : skipNum)
        .limit(limitNum)
        .lean()
    ]);

    let hasMore;
    if (cursorTs || cursorId) {
      if (history.length < limitNum) {
        hasMore = false;
      } else {
        const last = history[history.length - 1];
        const moreFilter = {
          ...filter,
          $or: [
            { timestamp: { $lt: last.timestamp } },
            { timestamp: last.timestamp, _id: { $lt: last._id } }
          ]
        };
        hasMore = !!(await PoolHistory.exists(moreFilter));
      }
    } else {
      hasMore = skipNum + history.length < total;
    }

    const nextCursor = hasMore && history.length
      ? { cursorTs: history[history.length - 1].timestamp, cursorId: history[history.length - 1]._id }
      : null;

    res.json({ history, meta: { total, limit: limitNum, skip: cursorTs || cursorId ? undefined : skipNum, hasMore, nextSkip: !cursorTs && !cursorId && hasMore ? skipNum + limitNum : null, nextCursor } });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения истории пула', error: error.message });
  }
});

// История ликвидности
router.get('/liquidity', async (req, res) => {
  try {
    const history = await PoolHistory.find({ type: 'liquidity' }).sort({ timestamp: -1 }).limit(200).lean();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения истории ликвидности', error: error.message });
  }
});
router.post('/liquidity', validate(poolLiquiditySchema), async (req, res) => {
  try {
    const { wallet, amountA, amountB, action, txHash, timestamp } = req.body;
    const entry = await PoolHistory.create({
      type: 'liquidity',
      wallet,
      amountA,
      amountB,
      action,
      txHash,
      timestamp: timestamp || Date.now()
    });
    res.status(201).json({ entry });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка записи истории ликвидности', error: error.message });
  }
});

// История обменов
router.get('/exchange', async (req, res) => {
  try {
    const history = await PoolHistory.find({ type: 'exchange' }).sort({ timestamp: -1 }).limit(200).lean();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения истории обменов', error: error.message });
  }
});
router.post('/exchange', validate(poolExchangeSchema), async (req, res) => {
  try {
    const { wallet, stablecoin, amount, txHash, timestamp } = req.body;
    const entry = await PoolHistory.create({
      type: 'exchange',
      wallet,
      stablecoin,
      amount,
      txHash,
      timestamp: timestamp || Date.now()
    });
    res.status(201).json({ entry });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка записи истории обменов', error: error.message });
  }
});

// История стейкинга
router.get('/staking', async (req, res) => {
  try {
    const history = await PoolHistory.find({ type: 'staking' }).sort({ timestamp: -1 }).limit(200).lean();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения истории стейкинга', error: error.message });
  }
});
router.post('/staking', validate(poolStakingSchema), async (req, res) => {
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
    res.status(201).json({ entry });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка записи истории стейкинга', error: error.message });
  }
});

// Аналитика
router.get('/analytics', async (req, res) => {
  try {
    const [liquidityCount, exchangeCount, stakingCount] = await Promise.all([
      PoolHistory.countDocuments({ type: 'liquidity' }),
      PoolHistory.countDocuments({ type: 'exchange' }),
      PoolHistory.countDocuments({ type: 'staking' })
    ]);

    const [lastLiquidity, lastExchange, lastStaking] = await Promise.all([
      PoolHistory.findOne({ type: 'liquidity' }).sort({ timestamp: -1 }).lean(),
      PoolHistory.findOne({ type: 'exchange' }).sort({ timestamp: -1 }).lean(),
      PoolHistory.findOne({ type: 'staking' }).sort({ timestamp: -1 }).lean()
    ]);

    res.json({
      stats: {
        liquidityCount,
        exchangeCount,
        stakingCount,
        lastLiquidity,
        lastExchange,
        lastStaking
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка аналитики', error: error.message });
  }
});

module.exports = router;
