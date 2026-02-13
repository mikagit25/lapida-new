const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const PoolHistory = require('../../models/PoolHistory');

const ts = (dateStr) => new Date(dateStr).toISOString();

describe('Pool & Token API', () => {
  let mongoServer;

  beforeAll(async () => {
    const envUri = process.env.MONGODB_URI;
    try {
      if (envUri) {
        await mongoose.connect(envUri, { dbName: 'lapida_test_db' });
      } else {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { dbName: 'lapida_test_db' });
      }
    } catch (err) {
      if (!envUri) {
        await mongoose.connect('mongodb://127.0.0.1:27017/lapida_test_db');
      } else {
        throw err;
      }
    }
  });

  beforeEach(async () => {
    await PoolHistory.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase().catch(() => {});
      await mongoose.connection.close().catch(() => {});
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('Validation', () => {
    it('rejects invalid history query params', async () => {
      const res = await request(app)
        .get('/api/pool/pool/history?limit=0')
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
    });

    it('rejects buy without wallet', async () => {
      await request(app)
        .post('/api/token/buy')
        .send({ amount: 10, txHash: '0x-no-wallet' })
        .expect(400);
    });
  });

  describe('Pool history pagination (cursor)', () => {
    const entries = [
      { wallet: 'alice', stablecoin: 'USDT', amount: 11, tokenAmount: 100, txHash: '0x2', timestamp: ts('2024-01-02T00:00:00Z') },
      { wallet: 'bob', stablecoin: 'USDT', amount: 10, tokenAmount: 90, txHash: '0x1', timestamp: ts('2024-01-01T00:00:00Z') }
    ];

    beforeEach(async () => {
      for (const e of entries) {
        await request(app).post('/api/token/buy').send(e).expect(201);
      }
    });

    it('returns cursor and paginates forward', async () => {
      const firstPage = await request(app)
        .get('/api/pool/pool/history?limit=1')
        .expect(200);

      expect(firstPage.body.meta).toMatchObject({ limit: 1, hasMore: true });
      expect(firstPage.body.meta.nextCursor).toBeTruthy();
      expect(firstPage.body.history[0].txHash).toBe('0x2');

      const { cursorTs, cursorId } = firstPage.body.meta.nextCursor;
      const secondPage = await request(app)
        .get(`/api/pool/pool/history?limit=1&cursorTs=${encodeURIComponent(cursorTs)}&cursorId=${cursorId}`)
        .expect(200);

      expect(secondPage.body.history[0].txHash).toBe('0x1');
      expect(secondPage.body.meta.hasMore).toBe(false);
    });
  });

  describe('Exchange/Stake persistence', () => {
    it('stores swap and stake operations in history', async () => {
      await request(app)
        .post('/api/token/swap')
        .send({ wallet: 'charlie', fromToken: 'USDT', toToken: 'LPD', amountIn: 5, amountOut: 50, price: 10, txHash: '0x-swap' })
        .expect(201);

      await request(app)
        .post('/api/token/stake')
        .send({ wallet: 'charlie', amount: 50, mlpd: 5, txHash: '0x-stake' })
        .expect(201);

      const history = await request(app)
        .get('/api/pool/pool/history?wallet=charlie')
        .expect(200);

      const types = history.body.history.map((h) => h.type).sort();
      expect(types).toEqual(['exchange', 'staking']);
    });
  });
});
