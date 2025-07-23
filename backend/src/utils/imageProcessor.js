const sharp = require('sharp');

/**
 * Сжимает и обрабатывает изображение для сохранения в БД
 * @param {Buffer} imageBuffer - буфер с изображением
 * @param {Object} options - опции обработки
 * @returns {Promise<Buffer>} - сжатое изображение в формате JPEG
 */
async function processAvatar(imageBuffer, options = {}) {
  const {
    width = 200,        // максимальная ширина
    height = 200,       // максимальная высота
    quality = 80,       // качество JPEG (1-100)
    format = 'jpeg'     // формат выходного файла
  } = options;

  try {
    // Обрабатываем изображение с помощью sharp
    const processedImage = await sharp(imageBuffer)
      .resize(width, height, {
        fit: 'cover',        // обрезаем до квадрата
        position: 'center'   // центрируем обрезку
      })
      .jpeg({ quality })     // конвертируем в JPEG с заданным качеством
      .toBuffer();

    return processedImage;
  } catch (error) {
    console.error('Error processing avatar:', error);
    throw new Error('Ошибка обработки изображения');
  }
}

/**
 * Проверяет, является ли файл изображением
 * @param {Buffer} buffer - буфер файла
 * @returns {Promise<boolean>} - true если это изображение
 */
async function isImage(buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    return metadata.format !== undefined;
  } catch (error) {
    return false;
  }
}

module.exports = {
  processAvatar,
  isImage
}; 