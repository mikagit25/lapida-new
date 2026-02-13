/**
 * Integration тесты для API endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');

const agent = request.agent(app); // держит cookies для CSRF

// Получаем заголовки/куки для CSRF-защищённых запросов
async function getCsrfHeaders(testAgent = agent) {
  const res = await testAgent.get('/api/csrf-token').expect(200);
  const token = res.body.token;
  const rawCookies = res.headers['set-cookie'];
  const cookies = Array.isArray(rawCookies)
    ? rawCookies.join('; ')
    : (rawCookies ? String(rawCookies) : '');
  return {
    token,
    cookies
  };
}

describe('API Integration Tests', () => {
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
      // Fallback: если memory server упал, пробуем локальный Mongo
      if (!envUri) {
        await mongoose.connect('mongodb://127.0.0.1:27017/lapida_test_db');
      } else {
        throw err;
      }
    }
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

  describe('Health Check', () => {
    it('GET /api/health должен вернуть статус ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          status: 'ok',
          app: 'lapida'
        })
      );
    });

    it('GET /api/health/db должен вернуть статус БД', async () => {
      const response = await request(app)
        .get('/api/health/db')
        .expect(200);

      expect(response.body).toHaveProperty('mongo');
      expect(response.body).toHaveProperty('dbName');
    });
  });

  describe('Authentication', () => {
    const testUser = {
      username: testHelpers.randomUsername(),
      email: testHelpers.randomEmail(),
      password: 'Test123Password',
      fullName: 'Test User'
    };

    it('POST /api/auth/register должен зарегистрировать нового пользователя', async () => {
      const { token: csrfToken, cookies } = await getCsrfHeaders();
      const response = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
    });

    it('POST /api/auth/register должен отклонить дубликат email', async () => {
      const { token: csrfToken, cookies } = await getCsrfHeaders();
      await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(testUser)
        .expect(400);
    });

    it('POST /api/auth/login должен войти с правильными credentials', async () => {
      const { token: csrfToken, cookies } = await getCsrfHeaders();
      const response = await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
    });

    it('POST /api/auth/login должен отклонить неверный пароль', async () => {
      const { token: csrfToken, cookies } = await getCsrfHeaders();
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send({
          email: testUser.email,
          password: 'WrongPassword123'
        })
        .expect(401);
    });

    it('POST /api/auth/register должен отклонить невалидные данные', async () => {
      const { token: csrfToken, cookies } = await getCsrfHeaders();
      const response = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send({
          name: 'ab', // слишком короткое имя
          email: 'invalid-email',
          password: '123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Memorials', () => {
    let authToken;
    let memorialId;

    beforeAll(async () => {
      // Создаем тестового пользователя и получаем токен
      const user = {
        username: testHelpers.randomUsername(),
        email: testHelpers.randomEmail(),
        password: 'Test123Password'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      authToken = response.body.token;
    });

    it('POST /api/memorials должен создать новый мемориал', async () => {
      const memorial = {
        firstName: 'Иван',
        lastName: 'Петров',
        birthDate: '1950-01-01',
        deathDate: '2020-12-31',
        biography: 'Тестовая биография',
        epitaph: 'Покойся с миром'
      };

      const response = await request(app)
        .post('/api/memorials')
        .set('Authorization', `Bearer ${authToken}`)
        .send(memorial)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.memorial).toHaveProperty('firstName', 'Иван');
      
      memorialId = response.body.memorial._id;
    });

    it('GET /api/memorials должен вернуть список мемориалов с pagination', async () => {
      const response = await request(app)
        .get('/api/memorials?page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination).toHaveProperty('total');
    });

    it('GET /api/memorials/:id должен вернуть конкретный мемориал', async () => {
      const response = await request(app)
        .get(`/api/memorials/${memorialId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.memorial).toHaveProperty('_id', memorialId);
    });

    it('GET /api/memorials/:id должен вернуть 404 для несуществующего мемориала', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/memorials/${fakeId}`)
        .expect(404);
    });

    it('PUT /api/memorials/:id должен обновить мемориал', async () => {
      const updates = {
        firstName: 'Иван',
        lastName: 'Петров',
        biography: 'Обновленная биография'
      };

      const response = await request(app)
        .put(`/api/memorials/${memorialId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.memorial).toHaveProperty('biography', 'Обновленная биография');
    });

    it('DELETE /api/memorials/:id должен удалить мемориал', async () => {
      await request(app)
        .delete(`/api/memorials/${memorialId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Проверяем что мемориал действительно удален
      await request(app)
        .get(`/api/memorials/${memorialId}`)
        .expect(404);
    });

    it('POST /api/memorials без токена должен вернуть 401', async () => {
      await request(app)
        .post('/api/memorials')
        .send({
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(401);
    });
  });

  describe('Users and Memorial Editors permissions', () => {
    let ownerToken;
    let editorToken;
    let strangerToken;
    let memorialId;
    let editorId;

    beforeAll(async () => {
      // Создаем владельца мемориала
      const owner = {
        name: `Owner ${Date.now()}`,
        email: testHelpers.randomEmail(),
        password: 'Owner123Password'
      };
      await request(app)
        .post('/api/auth/register')
        .send(owner)
        .expect(201);
      const ownerLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: owner.email, password: owner.password })
        .expect(200);
      ownerToken = ownerLogin.body.token;

      // Создаем будущего редактора
      const editor = {
        name: `Editor ${Date.now()}`,
        email: testHelpers.randomEmail(),
        password: 'Editor123Password'
      };
      await request(app)
        .post('/api/auth/register')
        .send(editor)
        .expect(201);
      const editorLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: editor.email, password: editor.password })
        .expect(200);
      editorToken = editorLogin.body.token;
      editorId = editorLogin.body.user.id;

      // Создаем стороннего пользователя
      const stranger = {
        name: `Stranger ${Date.now()}`,
        email: testHelpers.randomEmail(),
        password: 'Stranger123Password'
      };
      await request(app)
        .post('/api/auth/register')
        .send(stranger)
        .expect(201);
      const strangerLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: stranger.email, password: stranger.password })
        .expect(200);
      strangerToken = strangerLogin.body.token;

      // Создаем мемориал владельцем
      const memorial = {
        firstName: 'Редактор',
        lastName: 'Тестовый',
        birthDate: '1950-01-01',
        deathDate: '2020-12-31'
      };
      const memorialRes = await request(app)
        .post('/api/memorials')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(memorial)
        .expect(201);
      memorialId = memorialRes.body.memorial._id;
    });

    it('GET /api/users без токена возвращает 401', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });

    it('GET /api/users с токеном возвращает список', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/memorial-editors/:id/editors добавляет редактора', async () => {
      const res = await request(app)
        .post(`/api/memorial-editors/${memorialId}/editors`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          userId: editorId,
          sections: ['bio', 'gallery'],
          role: 'custom'
        })
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.editors.some(e => e.user.toString() === editorId)).toBe(true);
    });

    it('GET /api/memorial-editors/:id/editors доступен создателю', async () => {
      const res = await request(app)
        .get(`/api/memorial-editors/${memorialId}/editors`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(Array.isArray(res.body.editors)).toBe(true);
    });

    it('GET /api/memorial-editors/:id/editors доступен редактору', async () => {
      const res = await request(app)
        .get(`/api/memorial-editors/${memorialId}/editors`)
        .set('Authorization', `Bearer ${editorToken}`)
        .expect(200);

      expect(Array.isArray(res.body.editors)).toBe(true);
    });

    it('GET /api/memorial-editors/:id/editors запрещен постороннему пользователю', async () => {
      await request(app)
        .get(`/api/memorial-editors/${memorialId}/editors`)
        .set('Authorization', `Bearer ${strangerToken}`)
        .expect(403);
    });
  });

  describe('Rate Limiting', () => {
    it('должен ограничить количество запросов', async () => {
      // Делаем много запросов подряд
      const requests = Array(120).fill().map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.all(requests);
      
      // Как минимум один запрос должен быть отклонен с 429
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    }, 30000); // Увеличиваем timeout для этого теста
  });
});
