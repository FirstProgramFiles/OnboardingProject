const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testPassword() {
  try {
    console.log('🔍 Тестируем пароль для admin@example.com...\n');
    
    // Получаем пользователя из базы
    const user = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
      include: { role: true }
    });

    if (!user) {
      console.log('❌ Пользователь admin@example.com не найден!');
      return;
    }

    console.log(`👤 Пользователь: ${user.email}`);
    console.log(`🔑 Хеш пароля в базе: ${user.password}`);
    console.log(`👤 Роль: ${user.role?.name}\n`);

    // Тестируем правильный пароль
    const testPassword = 'admin123';
    const isCorrectPassword = await bcrypt.compare(testPassword, user.password);
    
    console.log(`🔍 Тестируем пароль: "${testPassword}"`);
    console.log(`✅ Результат сравнения: ${isCorrectPassword}\n`);

    // Тестируем неправильный пароль
    const wrongPassword = 'wrongpassword';
    const isWrongPassword = await bcrypt.compare(wrongPassword, user.password);
    
    console.log(`🔍 Тестируем неправильный пароль: "${wrongPassword}"`);
    console.log(`❌ Результат сравнения: ${isWrongPassword}\n`);

    // Генерируем новый хеш для сравнения
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log(`🔄 Новый хеш для "${testPassword}": ${newHash}`);
    
    const isNewHashCorrect = await bcrypt.compare(testPassword, newHash);
    console.log(`✅ Новый хеш работает: ${isNewHashCorrect}`);

  } catch (error) {
    console.error('❌ Ошибка при тестировании пароля:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword(); 