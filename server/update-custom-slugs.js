const mongoose = require('mongoose');
const Memorial = require('./models/Memorial');
require('dotenv').config();

const updateMemorialsWithCustomSlug = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida');
    console.log('Подключено к MongoDB');

    // Получаем все мемориалы без customSlug
    const memorials = await Memorial.find({ customSlug: { $exists: false } });
    console.log(`Найдено ${memorials.length} мемориалов без customSlug`);

    // Функция транслитерации
    const transliterate = (text) => {
      const cyrillicToLatin = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '-'
      };
      
      return text
        .toLowerCase()
        .split('')
        .map(char => cyrillicToLatin[char] || char)
        .join('')
        .replace(/[^\w\s-]/g, '') // удаляем остальные спецсимволы
        .replace(/\s+/g, '-') // заменяем пробелы на дефисы
        .replace(/-+/g, '-') // удаляем множественные дефисы
        .trim('-'); // убираем дефисы в начале и конце
    };

    for (const memorial of memorials) {
      // Генерируем customSlug из fullName с транслитерацией
      let baseSlug = transliterate(memorial.fullName);

      // Если slug пустой или только дефисы, используем shareUrl
      if (!baseSlug || baseSlug === '-' || baseSlug === '') {
        baseSlug = memorial.shareUrl || `memorial-${memorial._id}`;
      }

      // Проверяем уникальность и добавляем номер если нужно
      let customSlug = baseSlug;
      let counter = 1;
      
      while (await Memorial.findOne({ customSlug, _id: { $ne: memorial._id } })) {
        customSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      memorial.customSlug = customSlug;
      await memorial.save();
      
      console.log(`✅ Обновлен мемориал: ${memorial.fullName} -> ${customSlug}`);
    }

    console.log('Все мемориалы обновлены!');
    
    // Показываем результат
    const updatedMemorials = await Memorial.find({}).limit(5);
    console.log('\nОбновленные мемориалы:');
    updatedMemorials.forEach(m => {
      console.log(`- ${m.fullName} | shareUrl: ${m.shareUrl} | customSlug: ${m.customSlug}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
};

updateMemorialsWithCustomSlug();
