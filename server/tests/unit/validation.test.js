/**
 * Unit тесты для validation middleware
 */

const { validate, registerSchema, loginSchema, memorialSchema } = require('../../middleware/validation');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('registerSchema', () => {
    it('должен пропустить валидные данные регистрации', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Pass123word',
        fullName: 'Test User',
        phone: '+1234567890'
      };

      const middleware = validate(registerSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('должен отклонить короткий username', () => {
      req.body = {
        username: 'ab',
        email: 'test@example.com',
        password: 'Pass123word'
      };

      const middleware = validate(registerSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Ошибка валидации данных',
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'username'
            })
          ])
        })
      );
    });

    it('должен отклонить невалидный email', () => {
      req.body = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Pass123word'
      };

      const middleware = validate(registerSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'email'
            })
          ])
        })
      );
    });

    it('должен отклонить слабый пароль', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      };

      const middleware = validate(registerSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'password'
            })
          ])
        })
      );
    });

    it('должен отклонить пароль без заглавных букв', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const middleware = validate(registerSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('должен отклонить невалидный телефон', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Pass123word',
        phone: 'invalid'
      };

      const middleware = validate(registerSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('loginSchema', () => {
    it('должен пропустить валидные данные входа', () => {
      req.body = {
        email: 'test@example.com',
        password: 'anypassword'
      };

      const middleware = validate(loginSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('должен отклонить отсутствующий email', () => {
      req.body = {
        password: 'anypassword'
      };

      const middleware = validate(loginSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('memorialSchema', () => {
    it('должен пропустить валидные данные мемориала', () => {
      req.body = {
        firstName: 'Иван',
        lastName: 'Петров',
        middleName: 'Иванович',
        birthDate: '1950-01-01',
        deathDate: '2020-12-31',
        biography: 'Краткая биография...',
        epitaph: 'Покойся с миром'
      };

      const middleware = validate(memorialSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('должен отклонить слишком длинное имя', () => {
      req.body = {
        firstName: 'А'.repeat(101),
        lastName: 'Петров'
      };

      const middleware = validate(memorialSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('должен отклонить дату рождения в будущем', () => {
      req.body = {
        firstName: 'Иван',
        lastName: 'Петров',
        birthDate: '2030-01-01'
      };

      const middleware = validate(memorialSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('должен отклонить слишком длинную биографию', () => {
      req.body = {
        firstName: 'Иван',
        lastName: 'Петров',
        biography: 'A'.repeat(10001)
      };

      const middleware = validate(memorialSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
