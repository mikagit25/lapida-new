const express = require('express');
const router = express.Router();

// Получить общую информацию о пуле ликвидности
router.get('/pool/info', async (req, res) => {
  // TODO: Получить данные о пуле из web3 или БД
  res.json({
    pool: {
      totalLiquidity: 0,
      tokenA: 'LPD',
      tokenB: 'USDT',
      rewardToken: 'MLPD',
      apy: 0,
      userLiquidity: 0,
      userRewards: 0
    }
  });
});

// История операций пула
router.get('/pool/history', async (req, res) => {
  // TODO: Получить историю операций из БД
  res.json({
    history: [
      // { type: 'add', user: '0x...', amountA: 100, amountB: 100, timestamp: 1234567890 },
      // { type: 'remove', user: '0x...', lpTokens: 50, timestamp: 1234567891 },
      // { type: 'claim', user: '0x...', reward: 10, timestamp: 1234567892 }
    ]
  });
});

// MVP: хранение истории в памяти (заменить на БД при продакшене)
const liquidityHistory = [];
const exchangeHistory = [];
const stakingHistory = [];

// История ликвидности
router.get('/liquidity', (req, res) => {
  res.json({ history: liquidityHistory });
});
router.post('/liquidity', (req, res) => {
  const { wallet, amountA, amountB, action, txHash, timestamp } = req.body;
  if (!wallet || !amountA || !amountB || !action || !txHash) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = { wallet, amountA, amountB, action, txHash, timestamp: timestamp || Date.now() };
  liquidityHistory.push(entry);
  res.json({ success: true });
});

// История обменов
router.get('/exchange', (req, res) => {
  res.json({ history: exchangeHistory });
});
router.post('/exchange', (req, res) => {
  const { wallet, stablecoin, amount, txHash, timestamp } = req.body;
  if (!wallet || !stablecoin || !amount || !txHash) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = { wallet, stablecoin, amount, txHash, timestamp: timestamp || Date.now() };
  exchangeHistory.push(entry);
  res.json({ success: true });
});

// История стейкинга
router.get('/staking', (req, res) => {
  res.json({ history: stakingHistory });
});
router.post('/staking', (req, res) => {
  const { wallet, amount, txHash, mlpd, timestamp } = req.body;
  if (!wallet || !amount || !txHash || !mlpd) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = { wallet, amount, txHash, mlpd, timestamp: timestamp || Date.now() };
  stakingHistory.push(entry);
  res.json({ success: true });
});

// Аналитика
router.get('/analytics', (req, res) => {
  res.json({
    stats: {
      liquidityCount: liquidityHistory.length,
      exchangeCount: exchangeHistory.length,
      stakingCount: stakingHistory.length,
      lastLiquidity: liquidityHistory[liquidityHistory.length - 1] || null,
      lastExchange: exchangeHistory[exchangeHistory.length - 1] || null,
      lastStaking: stakingHistory[stakingHistory.length - 1] || null
    }
  });
});

module.exports = router;
