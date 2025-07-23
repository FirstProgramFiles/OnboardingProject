const multer = require('multer');

// Фильтр файлов - разрешаем только изображения
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены только JPEG, PNG и GIF.'), false);
  }
};

// Настройка multer для работы с памятью (не сохраняем файлы на диск)
const upload = multer({
  storage: multer.memoryStorage(), // Храним файл в памяти как Buffer
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB максимум
  }
});

module.exports = upload; 