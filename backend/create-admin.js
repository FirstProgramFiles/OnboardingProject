const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Проверяем, есть ли уже роль admin
    let adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    });

    // Если роли admin нет, создаём её
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: 'admin',
          description: 'Администратор системы'
        }
      });
      console.log('✅ Роль admin создана');
    } else {
      console.log('✅ Роль admin уже существует');
    }

    // Проверяем, есть ли уже пользователь с ролью admin
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: {
          name: 'admin'
        }
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Администратор уже существует:', existingAdmin.email);
      return;
    }

    // Создаём первого администратора
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        roleId: adminRole.id
      },
      include: {
        role: true
      }
    });

    console.log('✅ Первый администратор создан успешно!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Пароль: admin123');
    console.log('👤 Роль:', admin.role.name);
    console.log('\n⚠️  Не забудьте изменить пароль после первого входа!');

  } catch (error) {
    console.error('❌ Ошибка при создании администратора:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 