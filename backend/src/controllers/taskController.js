const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Получить все задачи текущего пользователя
exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userTasks = await prisma.userTask.findMany({
      where: { userId },
      include: { task: true }
    });
    res.json({ tasks: userTasks });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения задач' });
  }
};

// Обновить статус задачи пользователя
exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { id } = req.params;
    const { status } = req.body;
    console.log('PATCH userId:', userId, 'taskId:', id, 'status:', status);
    const userTask = await prisma.userTask.findUnique({ where: { id: Number(id) } });
    console.log('Найден userTask:', userTask);
    if (!userTask || userTask.userId !== userId) {
      console.log('UserTask не найден или userId не совпадает:', userTask, userId);
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    const updated = await prisma.userTask.update({
      where: { id: Number(id) },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null
      }
    });
    console.log('Обновлено:', updated);
    res.json({ task: updated });
  } catch (error) {
    console.error('Ошибка обновления статуса задачи:', error);
    res.status(500).json({ error: 'Ошибка обновления статуса задачи' });
  }
};

// Получить этапы онбординга с задачами и прогрессом для текущего пользователя
async function getOnboardingStagesWithTasksAndProgress(req, res) {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Получить пользователя с его должностью
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        positionRef: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Определить категорию пользователя на основе должности
    let userCategory = 'Общая'; // по умолчанию
    const positionName = user.positionRef?.name || user.position || '';
    
    if (positionName.toLowerCase().includes('инженер') || 
        positionName.toLowerCase().includes('менеджер') || 
        positionName.toLowerCase().includes('специалист') ||
        positionName.toLowerCase().includes('программист') ||
        positionName.toLowerCase().includes('бухгалтер')) {
      userCategory = 'ИТР';
    } else if (positionName.toLowerCase().includes('рабочий') ||
               positionName.toLowerCase().includes('оператор') ||
               positionName.toLowerCase().includes('машинист') ||
               positionName.toLowerCase().includes('слесарь') ||
               positionName.toLowerCase().includes('электромонтер')) {
      userCategory = 'Рабочие';
    }

    // Получить все этапы с задачами (сортировка по order)
    const stages = await prisma.onboardingStage.findMany({
      orderBy: { order: 'asc' },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        }
      }
    });

    // Получить статусы задач пользователя
    const userTasks = await prisma.userTask.findMany({
      where: { userId },
      select: { taskId: true, status: true }
    });
    const userTaskMap = {};
    for (const ut of userTasks) {
      userTaskMap[ut.taskId] = ut.status;
    }

    // Собрать структуру: этапы -> задачи -> статус (с фильтрацией по категории)
    const result = stages.map(stage => {
      // Фильтровать задачи по категории пользователя
      const filteredTasks = stage.tasks.filter(task => {
        // Показывать задачи категории "Общая" всем
        if (task.category === 'Общая') return true;
        // Показывать задачи категории "ИТР" только ИТР
        if (task.category === 'ИТР' && userCategory === 'ИТР') return true;
        // Показывать задачи категории "Рабочие" только рабочим
        if (task.category === 'Рабочие' && userCategory === 'Рабочие') return true;
        return false;
      });

      return {
      id: stage.id,
      name: stage.name,
      description: stage.description,
      order: stage.order,
      category: stage.category,
        tasks: filteredTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        order: task.order,
        category: task.category,
        status: userTaskMap[task.id] || 'pending'
      }))
      };
    }).filter(stage => stage.tasks.length > 0); // Убираем этапы без задач

    res.json({ stages: result });
  } catch (error) {
    console.error('Get onboarding stages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Обновить статус задачи этапа для текущего пользователя
async function updateUserTaskStatus(req, res) {
  try {
    const userId = req.user?.id || req.user?.userId;
    const taskId = parseInt(req.params.id);
    const { status } = req.body;
    if (!userId || !taskId || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    let userTask = await prisma.userTask.findFirst({ where: { userId, taskId } });
    if (!userTask) {
      userTask = await prisma.userTask.create({
        data: {
          userId,
          taskId,
          status,
          assignedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : null
        }
      });
    } else {
      userTask = await prisma.userTask.update({
        where: { id: userTask.id },
        data: {
          status,
          completedAt: status === 'completed' ? new Date() : null
        }
      });
    }
    res.json({ success: true, userTask });
  } catch (error) {
    console.error('Update user task status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.getOnboardingStagesWithTasksAndProgress = getOnboardingStagesWithTasksAndProgress;
module.exports.updateUserTaskStatus = updateUserTaskStatus; 