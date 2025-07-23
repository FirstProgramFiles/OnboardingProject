const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    console.log('🔧 Обновляем пароль администратора...\n');
    
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
    console.log(`👤 Роль: ${user.role?.name}\n`);

    // Создаём новый хеш для пароля admin123
    const newPassword = 'admin123';
    const newHash = await bcrypt.hash(newPassword, 10);
    
    // Обновляем пароль в базе
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@example.com' },
      data: { password: newHash }
    });

    console.log('✅ Пароль успешно обновлён!');
    console.log(`📧 Email: ${updatedUser.email}`);
    console.log(`🔑 Новый пароль: ${newPassword}`);
    console.log(`🔐 Новый хеш: ${newHash.substring(0, 20)}...\n`);

    // Проверяем, что новый пароль работает
    const isPasswordValid = await bcrypt.compare(newPassword, newHash);
    console.log(`✅ Проверка нового пароля: ${isPasswordValid}`);

  } catch (error) {
    console.error('❌ Ошибка при обновлении пароля:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword(); 