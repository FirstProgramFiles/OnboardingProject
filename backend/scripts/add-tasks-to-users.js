const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function addTasksToUsers() {
  try {
    console.log('🔧 Adding tasks to existing users...');

    // Получить всех пользователей
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);

    // Получить все глобальные задачи
    const globalTasks = await prisma.task.findMany({ where: { isGlobal: true } });
    console.log(`Found ${globalTasks.length} global tasks`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      for (const task of globalTasks) {
        // Проверить, есть ли уже UserTask для этой пары
        const existingUserTask = await prisma.userTask.findFirst({
          where: {
            userId: user.id,
            taskId: task.id
          }
        });

        if (!existingUserTask) {
          // Создать UserTask
          await prisma.userTask.create({
            data: {
              userId: user.id,
              taskId: task.id,
              status: 'pending',
              assignedAt: new Date()
            }
          });
          addedCount++;
        } else {
          skippedCount++;
        }
      }
    }

    console.log(`✅ Added ${addedCount} new UserTask records`);
    console.log(`⏭️ Skipped ${skippedCount} existing UserTask records`);
    console.log('🎉 Task assignment completed!');

  } catch (error) {
    console.error('❌ Error adding tasks to users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTasksToUsers(); 