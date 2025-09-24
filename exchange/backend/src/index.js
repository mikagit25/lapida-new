// История пула ликвидности (MVP: хранение в памяти)
const liquidityHistory = [];
const log = (type, data) => {
  console.log(`[${new Date().toISOString()}] [${type}]`, data);
};

app.get('/api/liquidity', (req, res) => {
  res.json({ history: liquidityHistory });
});
app.post('/api/liquidity', (req, res) => {
  const { wallet, amountA, amountB, action, txHash, timestamp } = req.body;
  if (!wallet || !amountA || !amountB || !action || !txHash) {
    log('liquidity_error', req.body);
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = { wallet, amountA, amountB, action, txHash, timestamp: timestamp || Date.now() };
  liquidityHistory.push(entry);
  log('liquidity_add', entry);
  res.json({ success: true });
});
const express = require('express');
const app = express();
app.use(express.json());

// История обменов (MVP: хранение в памяти)
const exchangeHistory = [];
app.get('/api/exchange', (req, res) => {
  res.json({ history: exchangeHistory });
});

app.post('/api/exchange', (req, res) => {
  const { wallet, stablecoin, amount, txHash, timestamp } = req.body;
  if (!wallet || !stablecoin || !amount || !txHash) {
    log('exchange_error', req.body);
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = { wallet, stablecoin, amount, txHash, timestamp: timestamp || Date.now() };
  exchangeHistory.push(entry);
  log('exchange_add', entry);
  res.json({ success: true });
});

// История стейкинга (MVP: хранение в памяти)
const stakingHistory = [];
app.get('/api/staking', (req, res) => {
  res.json({ history: stakingHistory });
});
app.post('/api/staking', (req, res) => {
  const { wallet, amount, txHash, mlpd, timestamp } = req.body;
  if (!wallet || !amount || !txHash || !mlpd) {
    log('staking_error', req.body);
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = { wallet, amount, txHash, mlpd, timestamp: timestamp || Date.now() };
  stakingHistory.push(entry);
  log('staking_add', entry);
  res.json({ success: true });
});
// Аналитика
app.get('/api/analytics', (req, res) => {
  // Пример расширенной аналитики
  const stats = {
    liquidityCount: liquidityHistory.length,
    exchangeCount: exchangeHistory.length,
    stakingCount: stakingHistory.length,
    lastLiquidity: liquidityHistory[liquidityHistory.length - 1] || null,
    lastExchange: exchangeHistory[exchangeHistory.length - 1] || null,
    lastStaking: stakingHistory[stakingHistory.length - 1] || null,
  };
  res.json({ stats });
});

// Прокси для DEX
app.post('/api/proxy', (req, res) => {
  // TODO: реализовать прокси для DEX
  try {
    // Здесь будет логика прокси
    log('proxy_call', req.body);
    res.json({ result: 'ok' });
  } catch (err) {
    log('proxy_error', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend started on port ${PORT}`);
});
