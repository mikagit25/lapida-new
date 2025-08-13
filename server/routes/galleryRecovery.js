const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Получить все изображения для мемориала по его ID
router.get('/memorials/:memorialId/images', (req, res) => {
  const memorialId = req.params.memorialId;
  const memorialDir = path.join(__dirname, '../upload/memorials');

  // Файлы имеют вид file-<timestamp>-<random>.jpg
  fs.readdir(memorialDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка чтения директории' });
    }
    // Фильтруем файлы, относящиеся к мемориалу (по имени или по базе, если есть)
    // Если нет связи, просто возвращаем все картинки
    const imageFiles = files.filter(f => f.match(/^file-.*\.jpg$/));
    res.json({ images: imageFiles });
  });
});

module.exports = router;
