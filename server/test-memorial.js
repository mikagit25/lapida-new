const axios = require('axios');

// Тестовые данные для создания мемориала
const testMemorialData = {
  firstName: "Тест",
  lastName: "Тестович", 
  birthDate: "1950-01-01",
  deathDate: "2020-01-01",
  biography: "Тестовая биография",
  epitaph: "Тестовая эпитафия"
};

async function testCreateMemorial() {
  try {
    console.log('Отправляем тестовый запрос на создание мемориала...');
    console.log('Данные:', testMemorialData);
    
    const response = await axios.post('http://localhost:5002/api/memorials', testMemorialData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Успех! Мемориал создан:', response.data);
  } catch (error) {
    console.error('Ошибка при создании мемориала:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testCreateMemorial();
