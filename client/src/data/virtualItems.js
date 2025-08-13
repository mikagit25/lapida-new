// База данных виртуальных свечей
const candlesData = [
  {
    id: 'candle-1',
    name: 'Белая свеча памяти',
    icon: '🕯️',
    color: '#ffffff',
    description: 'Традиционная белая свеча в память об усопшем',
    duration: 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
    price: 0 // бесплатная
  },
  {
    id: 'candle-2', 
    name: 'Золотая свеча',
    icon: '🕯️',
    color: '#ffd700',
    description: 'Золотая свеча для особых воспоминаний',
    duration: 48 * 60 * 60 * 1000, // 48 часов
    price: 50
  },
  {
    id: 'candle-3',
    name: 'Красная свеча любви',
    icon: '🕯️', 
    color: '#ff6b6b',
    description: 'Красная свеча как символ вечной любви',
    duration: 72 * 60 * 60 * 1000, // 72 часа
    price: 75
  },
  {
    id: 'candle-4',
    name: 'Синяя свеча умиротворения',
    icon: '🕯️',
    color: '#4dabf7', 
    description: 'Синяя свеча для душевного покоя',
    duration: 24 * 60 * 60 * 1000, // 24 часа
    price: 30
  },
  {
    id: 'candle-5',
    name: 'Фиолетовая свеча духовности',
    icon: '🕯️',
    color: '#9775fa',
    description: 'Фиолетовая свеча для духовной связи',
    duration: 36 * 60 * 60 * 1000, // 36 часов
    price: 60
  }
];

// База данных виртуальных цветов
const flowersData = [
  {
    id: 'flower-1',
    name: 'Белая роза',
    icon: '🌹',
    color: '#ffffff',
    description: 'Символ чистой любви и памяти',
    duration: 7 * 24 * 60 * 60 * 1000, // 7 дней
    price: 0
  },
  {
    id: 'flower-2',
    name: 'Красная роза', 
    icon: '🌹',
    color: '#ff6b6b',
    description: 'Символ страстной любви',
    duration: 7 * 24 * 60 * 60 * 1000,
    price: 25
  },
  {
    id: 'flower-3',
    name: 'Букет лилий',
    icon: '💐',
    color: '#ffffff',
    description: 'Лилии как символ возрождения души',
    duration: 10 * 24 * 60 * 60 * 1000, // 10 дней
    price: 100
  },
  {
    id: 'flower-4',
    name: 'Хризантемы',
    icon: '🌼',
    color: '#ffd43b',
    description: 'Традиционные цветы памяти',
    duration: 14 * 24 * 60 * 60 * 1000, // 14 дней
    price: 75
  }
];

// Класс для управления базой данных свечей
class CandlesDatabase {
  constructor() {
    this.candles = candlesData;
  }

  getAll() {
    return this.candles;
  }

  getById(id) {
    return this.candles.find(candle => candle.id === id);
  }

  getByIds(ids) {
    return this.candles.filter(candle => ids.includes(candle.id));
  }

  getFree() {
    return this.candles.filter(candle => candle.price === 0);
  }

  getPaid() {
    return this.candles.filter(candle => candle.price > 0);
  }
}

// Класс для управления базой данных цветов
class FlowersDatabase {
  constructor() {
    this.flowers = flowersData;
  }

  getAll() {
    return this.flowers;
  }

  getById(id) {
    return this.flowers.find(flower => flower.id === id);
  }

  getByIds(ids) {
    return this.flowers.filter(flower => ids.includes(flower.id));
  }

  getFree() {
    return this.flowers.filter(flower => flower.price === 0);
  }

  getPaid() {
    return this.flowers.filter(flower => flower.price > 0);
  }
}

// Экспортируем экземпляры классов
export const candlesDatabase = new CandlesDatabase();
export const flowersDatabase = new FlowersDatabase();

// Экспортируем сырые данные
export { candlesData, flowersData };

// Утилитарные функции
export const createVirtualItem = (type, id, memorialId, userId) => {
  const database = type === 'candle' ? candlesDatabase : flowersDatabase;
  const item = database.getById(id);
  
  if (!item) {
    throw new Error(`Virtual item with id ${id} not found`);
  }

  const expiresAt = new Date(Date.now() + item.duration);
  
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    itemId: id,
    memorialId,
    userId,
    createdAt: new Date(),
    expiresAt,
    isActive: true,
    itemData: item
  };
};

export const isVirtualItemActive = (item) => {
  if (!item.expiresAt) return true;
  return new Date() < new Date(item.expiresAt);
};

export const getTimeRemaining = (item) => {
  if (!item.expiresAt) return null;
  const now = new Date();
  const expires = new Date(item.expiresAt);
  const diff = expires - now;
  
  if (diff <= 0) return null;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, total: diff };
};
