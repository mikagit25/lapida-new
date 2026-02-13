/**
 * Unit тесты для pagination middleware
 */

const { paginate, paginatedResponse, sorting, filtering, search } = require('../../middleware/pagination');

describe('Pagination Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {};
    next = jest.fn();
  });

  describe('paginate()', () => {
    it('должен установить дефолтные значения pagination', () => {
      const middleware = paginate();
      middleware(req, res, next);

      expect(req.pagination).toEqual({
        page: 1,
        limit: 20,
        skip: 0
      });
      expect(next).toHaveBeenCalled();
    });

    it('должен использовать значения из query', () => {
      req.query = { page: '3', limit: '50' };
      const middleware = paginate();
      middleware(req, res, next);

      expect(req.pagination).toEqual({
        page: 3,
        limit: 50,
        skip: 100 // (3-1) * 50
      });
    });

    it('должен ограничивать максимальный limit', () => {
      req.query = { limit: '1000' };
      const middleware = paginate(20, 100);
      middleware(req, res, next);

      expect(req.pagination.limit).toBe(100);
    });

    it('должен валидировать минимальные значения', () => {
      req.query = { page: '-5', limit: '-10' };
      const middleware = paginate();
      middleware(req, res, next);

      expect(req.pagination.page).toBe(1);
      expect(req.pagination.limit).toBe(20);
    });
  });

  describe('paginatedResponse()', () => {
    it('должен генерировать корректный ответ с pagination', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const total = 100;
      const pagination = { page: 2, limit: 20 };

      const response = paginatedResponse(data, total, pagination);

      expect(response).toEqual({
        success: true,
        data,
        pagination: {
          page: 2,
          limit: 20,
          total: 100,
          totalPages: 5,
          hasNextPage: true,
          hasPrevPage: true,
          nextPage: 3,
          prevPage: 1
        }
      });
    });

    it('должен корректно обрабатывать последнюю страницу', () => {
      const pagination = { page: 5, limit: 20 };
      const response = paginatedResponse([], 100, pagination);

      expect(response.pagination.hasNextPage).toBe(false);
      expect(response.pagination.nextPage).toBe(null);
    });

    it('должен корректно обрабатывать первую страницу', () => {
      const pagination = { page: 1, limit: 20 };
      const response = paginatedResponse([], 100, pagination);

      expect(response.pagination.hasPrevPage).toBe(false);
      expect(response.pagination.prevPage).toBe(null);
    });
  });

  describe('sorting()', () => {
    it('должен установить дефолтную сортировку', () => {
      const middleware = sorting(['name', 'createdAt']);
      middleware(req, res, next);

      expect(req.sorting).toEqual({ createdAt: -1 });
    });

    it('должен использовать значения из query', () => {
      req.query = { sortBy: 'name', order: 'asc' };
      const middleware = sorting(['name', 'price']);
      middleware(req, res, next);

      expect(req.sorting).toEqual({ name: 1 });
    });

    it('должен игнорировать недопустимые поля', () => {
      req.query = { sortBy: 'password' };
      const middleware = sorting(['name', 'price']);
      middleware(req, res, next);

      expect(req.sorting).toEqual({ createdAt: -1 }); // Fallback к дефолтному
    });
  });

  describe('filtering()', () => {
    it('должен применить фильтры из query', () => {
      req.query = { category: 'flowers', isActive: 'true' };
      const middleware = filtering(['category', 'isActive']);
      middleware(req, res, next);

      expect(req.filters).toEqual({
        category: 'flowers',
        isActive: true
      });
    });

    it('должен обрабатывать диапазон цен', () => {
      req.query = { priceMin: '100', priceMax: '500' };
      const middleware = filtering(['category']);
      middleware(req, res, next);

      expect(req.filters.price).toEqual({
        $gte: 100,
        $lte: 500
      });
    });

    it('должен игнорировать недопустимые поля', () => {
      req.query = { password: 'hack', category: 'flowers' };
      const middleware = filtering(['category']);
      middleware(req, res, next);

      expect(req.filters).toEqual({ category: 'flowers' });
      expect(req.filters.password).toBeUndefined();
    });
  });

  describe('search()', () => {
    it('должен создать OR запрос для поиска', () => {
      req.query = { search: 'test' };
      const middleware = search(['name', 'description']);
      middleware(req, res, next);

      expect(req.searchQuery).toEqual({
        $or: [
          { name: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } }
        ]
      });
    });

    it('должен использовать текстовый поиск если поля не указаны', () => {
      req.query = { search: 'test' };
      const middleware = search();
      middleware(req, res, next);

      expect(req.searchQuery).toEqual({
        $text: { $search: 'test' }
      });
    });

    it('должен вернуть пустой объект если нет поиска', () => {
      const middleware = search(['name']);
      middleware(req, res, next);

      expect(req.searchQuery).toEqual({});
    });
  });
});
