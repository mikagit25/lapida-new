const mongoose = require('mongoose');
const Memorial = require('./models/Memorial');
require('dotenv').config();

const testMemorialCreation = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida');
    console.log('✅ Подключено к MongoDB');

    // Тестовые данные для создания мемориала
    const testCases = [
      { firstName: 'Иван', lastName: 'Петров' },
      { firstName: 'John', lastName: 'Smith' },
      { firstName: 'Мария', lastName: 'Сидорова' },
      { firstName: 'Test', lastName: 'User' }
    ];

    console.log('\n🧪 Тестируем генерацию customSlug...\n');

    for (const testCase of testCases) {
      console.log(`Тестируем: ${testCase.firstName} ${testCase.lastName}`);
      
      // Создаем временный мемориал без сохранения в БД
      const memorial = new Memorial({
        firstName: testCase.firstName,
        lastName: testCase.lastName,
        birthDate: new Date('1980-01-01'),
        deathDate: new Date('2020-01-01'),
        createdBy: new mongoose.Types.ObjectId(),
        location: {
          cemetery: 'Тестовое кладбище'
        }
      });

      // Вызываем pre-save хук вручную для генерации slug
      await memorial.validate();
      
      // Имитируем процесс создания нового мемориала
      memorial.isNew = true;
      memorial.customSlug = null;
      
      // Вызываем функцию из pre-save hook
      // Для этого создадим временную функцию
      const generateCustomSlug = async function() {
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
            .replace(/^-+|-+$/g, ''); // убираем дефисы в начале и конце
        };

        const baseSlug = transliterate(`${this.firstName} ${this.lastName}`);
        
        // Если slug пустой после обработки, используем shareUrl
        if (!baseSlug || baseSlug === '-' || baseSlug === '') {
          this.customSlug = this.shareUrl || `memorial-${Date.now()}`;
        } else {
          // Проверяем уникальность slug'а
          let slug = baseSlug;
          let counter = 1;
          
          while (await Memorial.findOne({ customSlug: slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
          
          this.customSlug = slug;
        }
      };

      await generateCustomSlug.call(memorial);
      
      console.log(`  ➜ Сгенерированный customSlug: "${memorial.customSlug}"`);
      console.log(`  ➜ URL будет: localhost:5183/${memorial.customSlug}`);
      console.log(`  ➜ Для продакшена: lapida.one/${memorial.customSlug}`);
      console.log('');
    }

    console.log('✅ Тестирование завершено');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
};

testMemorialCreation();
