const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Конфигурация оптимизации изображений
 */
const imageConfig = {
  // Размеры для разных типов изображений
  sizes: {
    thumbnail: { width: 200, height: 200, fit: 'cover' },
    small: { width: 400, height: 400, fit: 'inside' },
    medium: { width: 800, height: 800, fit: 'inside' },
    large: { width: 1920, height: 1920, fit: 'inside' },
    original: null // Не изменять размер, только оптимизировать
  },
  
  // Настройки качества
  quality: {
    jpeg: 85,
    webp: 85,
    png: 90
  },
  
  // Форматы вывода
  formats: ['jpeg', 'webp'],
  
  // Максимальный размер файла (10MB)
  maxFileSize: 10 * 1024 * 1024
};

/**
 * Оптимизация изображения
 * @param {Buffer|string} input - путь к файлу или Buffer
 * @param {string} outputPath - путь для сохранения
 * @param {object} options - опции оптимизации
 * @returns {Promise<object>} - информация о сохраненных файлах
 */
const optimizeImage = async (input, outputPath, options = {}) => {
  try {
    const {
      sizes = ['medium'],
      formats = imageConfig.formats,
      quality = imageConfig.quality,
      keepOriginal = false
    } = options;
    
    // Загружаем изображение
    let sharpInstance = sharp(input);
    const metadata = await sharpInstance.metadata();
    
    // Проверяем размер оригинала
    if (metadata.size > imageConfig.maxFileSize) {
      throw new Error(`Файл слишком большой: ${(metadata.size / 1024 / 1024).toFixed(2)}MB. Максимум: ${imageConfig.maxFileSize / 1024 / 1024}MB`);
    }
    
    const results = [];
    const dir = path.dirname(outputPath);
    const filename = path.basename(outputPath, path.extname(outputPath));
    
    // Создаем директорию если не существует
    await fs.mkdir(dir, { recursive: true });
    
    // Обрабатываем каждый размер
    for (const sizeKey of sizes) {
      const sizeConfig = imageConfig.sizes[sizeKey];
      
      for (const format of formats) {
        const suffix = sizeKey === 'original' ? '' : `_${sizeKey}`;
        const outputFile = path.join(dir, `${filename}${suffix}.${format}`);
        
        sharpInstance = sharp(input);
        
        // Применяем изменение размера если нужно
        if (sizeConfig) {
          sharpInstance = sharpInstance.resize(sizeConfig.width, sizeConfig.height, {
            fit: sizeConfig.fit || 'inside',
            withoutEnlargement: true
          });
        }
        
        // Применяем формат и качество
        if (format === 'jpeg' || format === 'jpg') {
          sharpInstance = sharpInstance.jpeg({ 
            quality: quality.jpeg,
            progressive: true,
            mozjpeg: true
          });
        } else if (format === 'webp') {
          sharpInstance = sharpInstance.webp({ 
            quality: quality.webp,
            effort: 4
          });
        } else if (format === 'png') {
          sharpInstance = sharpInstance.png({ 
            quality: quality.png,
            compressionLevel: 9
          });
        }
        
        // Сохраняем
        await sharpInstance.toFile(outputFile);
        
        const stats = await fs.stat(outputFile);
        results.push({
          size: sizeKey,
          format,
          path: outputFile,
          fileSize: stats.size,
          fileSizeMB: (stats.size / 1024 / 1024).toFixed(2)
        });
      }
    }
    
    // Логируем результаты
    const totalSize = results.reduce((sum, r) => sum + r.fileSize, 0);
    console.log(`🖼️  Оптимизировано: ${filename}, ${results.length} файлов, ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    
    return {
      success: true,
      original: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      },
      results
    };
    
  } catch (error) {
    console.error('Ошибка оптимизации изображения:', error.message);
    throw error;
  }
};

/**
 * Middleware для автоматической оптимизации загруженных изображений
 * Используется после multer middleware
 */
const optimizeUploadedImages = (options = {}) => {
  return async (req, res, next) => {
    try {
      // Проверяем наличие файлов
      if (!req.file && !req.files) {
        return next();
      }
      
      const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file];
      const optimizedFiles = [];
      
      for (const file of files) {
        // Проверяем, что это изображение
        if (!file.mimetype.startsWith('image/')) {
          optimizedFiles.push(file);
          continue;
        }
        
        try {
          const result = await optimizeImage(
            file.path,
            file.path,
            {
              sizes: options.sizes || ['medium'],
              formats: options.formats || ['jpeg', 'webp'],
              keepOriginal: options.keepOriginal !== false
            }
          );
          
          // Обновляем информацию о файле
          file.optimized = result.results;
          optimizedFiles.push(file);
          
        } catch (error) {
          console.error(`Ошибка оптимизации ${file.originalname}:`, error.message);
          // Если оптимизация не удалась, используем оригинал
          optimizedFiles.push(file);
        }
      }
      
      // Обновляем req.file(s) с оптимизированными версиями
      if (req.file) {
        req.file = optimizedFiles[0];
      }
      if (req.files) {
        if (Array.isArray(req.files)) {
          req.files = optimizedFiles;
        } else {
          // Для объекта с полями
          Object.keys(req.files).forEach((key, index) => {
            req.files[key] = optimizedFiles[index];
          });
        }
      }
      
      next();
      
    } catch (error) {
      console.error('Middleware оптимизации изображений ошибка:', error.message);
      next(error);
    }
  };
};

/**
 * Создание thumbnail для изображения
 * @param {string} inputPath - путь к исходному изображению
 * @param {string} outputPath - путь для сохранения thumbnail
 * @param {number} size - размер thumbnail (по умолчанию 200px)
 * @returns {Promise<string>} - путь к созданному thumbnail
 */
const createThumbnail = async (inputPath, outputPath = null, size = 200) => {
  try {
    if (!outputPath) {
      const dir = path.dirname(inputPath);
      const filename = path.basename(inputPath, path.extname(inputPath));
      const ext = path.extname(inputPath);
      outputPath = path.join(dir, `${filename}_thumb${ext}`);
    }
    
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath);
    
    return outputPath;
    
  } catch (error) {
    console.error('Ошибка создания thumbnail:', error.message);
    throw error;
  }
};

/**
 * Конвертация изображения в WebP
 * @param {string} inputPath - путь к исходному изображению
 * @param {string} outputPath - путь для сохранения WebP (опционально)
 * @returns {Promise<string>} - путь к WebP файлу
 */
const convertToWebP = async (inputPath, outputPath = null) => {
  try {
    if (!outputPath) {
      outputPath = inputPath.replace(/\.[^.]+$/, '.webp');
    }
    
    await sharp(inputPath)
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);
    
    return outputPath;
    
  } catch (error) {
    console.error('Ошибка конвертации в WebP:', error.message);
    throw error;
  }
};

/**
 * Получить информацию об изображении
 * @param {string} imagePath - путь к изображению
 * @returns {Promise<object>} - метаданные изображения
 */
const getImageInfo = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = await fs.stat(imagePath);
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      sizeMB: (stats.size / 1024 / 1024).toFixed(2),
      hasAlpha: metadata.hasAlpha,
      space: metadata.space,
      channels: metadata.channels
    };
    
  } catch (error) {
    console.error('Ошибка получения информации об изображении:', error.message);
    throw error;
  }
};

/**
 * Пакетная оптимизация изображений в директории
 * @param {string} directory - путь к директории
 * @param {object} options - опции оптимизации
 * @returns {Promise<Array>} - результаты оптимизации
 */
const optimizeDirectory = async (directory, options = {}) => {
  try {
    const files = await fs.readdir(directory);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    
    console.log(`🔄 Оптимизация ${imageFiles.length} изображений в ${directory}...`);
    
    const results = [];
    
    for (const file of imageFiles) {
      const inputPath = path.join(directory, file);
      try {
        const result = await optimizeImage(inputPath, inputPath, options);
        results.push({ file, ...result });
      } catch (error) {
        console.error(`Ошибка обработки ${file}:`, error.message);
        results.push({ file, success: false, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Оптимизировано: ${successCount}/${imageFiles.length} изображений`);
    
    return results;
    
  } catch (error) {
    console.error('Ошибка оптимизации директории:', error.message);
    throw error;
  }
};

module.exports = {
  optimizeImage,
  optimizeUploadedImages,
  createThumbnail,
  convertToWebP,
  getImageInfo,
  optimizeDirectory,
  imageConfig
};
