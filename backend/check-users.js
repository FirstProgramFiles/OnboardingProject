const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Проверяем пользователей в базе данных...\n');
    
    const users = await prisma.user.findMany({
      include: {
        role: true
      }
    });

    if (users.length === 0) {
      console.log('❌ Пользователей в базе нет!');
      return;
    }

    console.log(`✅ Найдено пользователей: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`👤 Пользователь #${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Роль: ${user.role?.name || 'Не указана'}`);
      console.log(`   Дата создания: ${user.createdAt}`);
      console.log(`   Пароль (хеш): ${user.password.substring(0, 20)}...`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Ошибка при получении пользователей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 