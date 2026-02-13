const mongoose = require('mongoose');

/**
 * Создание индексов для оптимизации запросов к базе данных
 * Запускается автоматически при старте приложения
 */
const createIndexes = async () => {
  console.log('📊 Создание индексов MongoDB...');
  
  try {
    const db = mongoose.connection.db;
    
    // ========== USERS (Пользователи) ==========
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true, name: 'email_unique' },
      { key: { username: 1 }, unique: true, sparse: true, name: 'username_unique' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { role: 1 }, name: 'role_index' },
      { key: { isActive: 1 }, name: 'isActive_index' },
    ]);
    console.log('  ✅ Users индексы созданы');

    // ========== MEMORIALS (Мемориалы) ==========
    await db.collection('memorials').createIndexes([
      { key: { shareUrl: 1 }, unique: true, sparse: true, name: 'shareUrl_unique' },
      { key: { createdBy: 1 }, name: 'createdBy_index' },
      { key: { firstName: 1, lastName: 1 }, name: 'fullName_index' },
      { key: { deathDate: -1 }, name: 'deathDate_desc' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { isPublic: 1 }, name: 'isPublic_index' },
      { key: { views: -1 }, name: 'views_desc' },
      // Текстовый поиск по имени и биографии
      { 
        key: { firstName: 'text', lastName: 'text', biography: 'text' }, 
        name: 'text_search',
        weights: { firstName: 3, lastName: 3, biography: 1 }
      },
    ]);
    console.log('  ✅ Memorials индексы созданы');

    // ========== COMPANIES (Компании) ==========
    await db.collection('companies').createIndexes([
      { key: { slug: 1 }, unique: true, name: 'slug_unique' },
      { key: { ownerId: 1 }, name: 'ownerId_index' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { isActive: 1 }, name: 'isActive_index' },
      { key: { city: 1 }, name: 'city_index' },
      { key: { category: 1 }, name: 'category_index' },
      { key: { rating: -1 }, name: 'rating_desc' },
      // Текстовый поиск по названию и описанию
      { 
        key: { name: 'text', description: 'text' }, 
        name: 'text_search',
        weights: { name: 3, description: 1 }
      },
    ]);
    console.log('  ✅ Companies индексы созданы');

    // ========== PRODUCTS (Товары) ==========
    await db.collection('products').createIndexes([
      { key: { companyId: 1, isActive: 1 }, name: 'company_active_index' },
      { key: { category: 1 }, name: 'category_index' },
      { key: { price: 1 }, name: 'price_asc' },
      { key: { price: -1 }, name: 'price_desc' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { views: -1 }, name: 'views_desc' },
      { key: { slug: 1 }, sparse: true, name: 'slug_index' },
      // Составной индекс для фильтрации
      { key: { companyId: 1, category: 1, price: 1 }, name: 'company_category_price' },
      // Текстовый поиск
      { 
        key: { name: 'text', description: 'text' }, 
        name: 'text_search',
        weights: { name: 3, description: 1 }
      },
    ]);
    console.log('  ✅ Products индексы созданы');

    // ========== ORDERS (Заказы) ==========
    await db.collection('orders').createIndexes([
      { key: { userId: 1, createdAt: -1 }, name: 'user_orders' },
      { key: { companyId: 1, createdAt: -1 }, name: 'company_orders' },
      { key: { status: 1 }, name: 'status_index' },
      { key: { orderNumber: 1 }, unique: true, sparse: true, name: 'orderNumber_unique' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      // Составной индекс для фильтрации заказов компании по статусу
      { key: { companyId: 1, status: 1, createdAt: -1 }, name: 'company_status_date' },
    ]);
    console.log('  ✅ Orders индексы созданы');

    // ========== COMMENTS (Комментарии) ==========
    await db.collection('comments').createIndexes([
      { key: { memorialId: 1, createdAt: -1 }, name: 'memorial_comments' },
      { key: { companyId: 1, createdAt: -1 }, name: 'company_comments' },
      { key: { authorId: 1 }, name: 'author_index' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { isApproved: 1 }, name: 'isApproved_index' },
    ]);
    console.log('  ✅ Comments индексы созданы');

    // ========== PHOTOCOMMENTS (Комментарии к фото) ==========
    await db.collection('photocomments').createIndexes([
      { key: { memorialId: 1, photoId: 1 }, name: 'memorial_photo_comments' },
      { key: { authorId: 1 }, name: 'author_index' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
    ]);
    console.log('  ✅ PhotoComments индексы созданы');

    // ========== NOTIFICATIONS (Уведомления) ==========
    await db.collection('notifications').createIndexes([
      { key: { userId: 1, isRead: 1, createdAt: -1 }, name: 'user_notifications' },
      { key: { companyId: 1, isRead: 1, createdAt: -1 }, name: 'company_notifications' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      // TTL индекс для автоматического удаления старых прочитанных уведомлений (через 30 дней)
      { key: { createdAt: 1 }, expireAfterSeconds: 2592000, partialFilterExpression: { isRead: true }, name: 'ttl_read_notifications' },
    ]);
    console.log('  ✅ Notifications индексы созданы');

    // ========== TIMELINE EVENTS (События временной линии) ==========
    await db.collection('timelineevents').createIndexes([
      { key: { memorialId: 1, date: 1 }, name: 'memorial_timeline' },
      { key: { memorialId: 1, year: 1 }, name: 'memorial_year' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
    ]);
    console.log('  ✅ TimelineEvents индексы созданы');

    // ========== RELIGIOUS ORGANIZATIONS (Ритуальные организации) ==========
    await db.collection('religiousorganizations').createIndexes([
      { key: { city: 1 }, name: 'city_index' },
      { key: { confession: 1 }, name: 'confession_index' },
      { key: { isPublic: 1 }, name: 'isPublic_index' },
      { key: { hasEmergency: 1 }, name: 'hasEmergency_index' },
      { key: { rating: -1 }, name: 'rating_desc' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { city: 1, confession: 1, isPublic: 1, rating: -1 }, name: 'filter_city_confession_public_rating' },
      // Текстовый поиск по названию/описанию/городу
      { 
        key: { name: 'text', description: 'text', 'contacts.address.city': 'text' }, 
        name: 'text_search',
        weights: { name: 5, description: 2, 'contacts.address.city': 3 }
      },
    ]);
    console.log('  ✅ ReligiousOrganizations индексы обновлены');

    // ========== RELIGIOUS SERVICES (Услуги организаций) ==========
    await db.collection('religiousservices').createIndexes([
      { key: { organization: 1, available: 1 }, name: 'org_available' },
      { key: { organization: 1, category: 1 }, name: 'org_category' },
      { key: { isEmergency: 1 }, name: 'emergency_index' },
      { key: { priceMin: 1, priceMax: 1 }, name: 'price_range' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
    ]);
    console.log('  ✅ ReligiousServices индексы созданы');

    // ========== LEAD REQUESTS (Заявки) ==========
    await db.collection('leadrequests').createIndexes([
      { key: { organization: 1, status: 1, createdAt: -1 }, name: 'org_status_createdAt' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
    ]);
    console.log('  ✅ LeadRequests индексы созданы');

    // ========== PSYCHOLOGIST SESSIONS (Сессии психолога) ==========
    await db.collection('psychologistsessions').createIndexes([
      { key: { userId: 1, createdAt: -1 }, name: 'user_sessions' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { status: 1 }, name: 'status_index' },
      // TTL индекс для автоматического удаления старых сессий (через 90 дней)
      { key: { createdAt: 1 }, expireAfterSeconds: 7776000, name: 'ttl_old_sessions' },
    ]);
    console.log('  ✅ PsychologistSessions индексы созданы');

    // ========== PAGES (Страницы памяти) ==========
    await db.collection('pages').createIndexes([
      { key: { memorialId: 1 }, name: 'memorial_pages' },
      { key: { slug: 1 }, sparse: true, name: 'slug_index' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
    ]);
    console.log('  ✅ Pages индексы созданы');

    // ========== VIRTUAL ITEMS (Виртуальные предметы) ==========
    await db.collection('virtualitems').createIndexes([
      { key: { memorialId: 1 }, name: 'memorial_items' },
      { key: { type: 1 }, name: 'type_index' },
      { key: { userId: 1 }, name: 'user_items' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
    ]);
    console.log('  ✅ VirtualItems индексы созданы');

    // ========== COMPANY VIEWS (Просмотры компаний) ==========
    await db.collection('companyviews').createIndexes([
      { key: { companyId: 1, date: -1 }, name: 'company_views' },
      { key: { date: -1 }, name: 'date_desc' },
      // TTL индекс для автоматического удаления старой статистики (через 180 дней)
      { key: { date: 1 }, expireAfterSeconds: 15552000, name: 'ttl_old_views' },
    ]);
    console.log('  ✅ CompanyViews индексы созданы');

    console.log('✅ Все индексы успешно созданы!');
    
    // Статистика индексов
    const collections = await db.listCollections().toArray();
    console.log(`\n📈 Статистика: ${collections.length} коллекций проиндексировано`);
    
  } catch (error) {
    // Код 85 / сообщение "Index already exists with a different name" появляется,
    // если в БД уже есть индексы с другими именами на те же поля. Для старых
    // баз это не критично, поэтому не валим запуск, а выводим предупреждение.
    if (error?.code === 85 || /Index already exists with a different name/i.test(error?.message || '')) {
      console.warn('⚠️  Индексы уже существуют (другие имена). Пропускаем создание, но можно пересоздать вручную через `db.collection.dropIndex(...)` при необходимости.');
      return;
    }
    console.error('❌ Ошибка при создании индексов:', error.message);
    throw error;
  }
};

/**
 * Получить статистику использования индексов
 */
const getIndexStats = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = ['memorials', 'companies', 'products', 'orders', 'users'];
    
    console.log('\n📊 Статистика индексов:');
    
    for (const collectionName of collections) {
      const stats = await db.collection(collectionName).indexInformation();
      console.log(`\n${collectionName}:`, Object.keys(stats).length, 'индексов');
      Object.keys(stats).forEach(indexName => {
        console.log(`  - ${indexName}`);
      });
    }
  } catch (error) {
    console.error('Ошибка получения статистики индексов:', error.message);
  }
};

module.exports = {
  createIndexes,
  getIndexStats,
};
