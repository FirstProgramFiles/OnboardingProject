const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function seedReferenceData() {
  try {
    console.log('🌱 Seeding reference data...');

    // Seed departments
    const departments = [
      { name: 'Производственный отдел' },
      { name: 'Отдел ИТ' },
      { name: 'Бухгалтерия' },
      { name: 'Отдел кадров' },
      { name: 'Отдел безопасности' },
      { name: 'Технический отдел' }
    ];

    for (const dept of departments) {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept
      });
    }
    console.log('✅ Departments seeded');

    // Seed positions
    const positions = [
      { name: 'Инженер' },
      { name: 'Рабочий' },
      { name: 'Менеджер' },
      { name: 'Бухгалтер' },
      { name: 'Программист' },
      { name: 'Специалист по охране труда' }
    ];

    for (const pos of positions) {
      await prisma.position.upsert({
        where: { name: pos.name },
        update: {},
        create: pos
      });
    }
    console.log('✅ Positions seeded');

    // Seed onboarding stages with real company structure
    const stages = [
      { name: '1. Прохождение инструктажей', description: 'Обязательные инструктажи по безопасности', order: 1, category: 'Общая' },
      { name: '2. Изучение инструкций', description: 'Инструкции по охране труда и пожарной безопасности', order: 2, category: 'Общая' },
      { name: '3. Получение пропуска', description: 'Оформление пропуска на предприятие', order: 3, category: 'Общая' },
      { name: '4. Получение спецодежды', description: 'Спецодежда для рабочего персонала', order: 4, category: 'Рабочие' },
      { name: '5. Нормативная база', description: 'Изучение документации', order: 5, category: 'Общая' },
      { name: '6. Программа дублирования', description: 'Дублирование для рабочего персонала', order: 6, category: 'Рабочие' },
      { name: '7. Проверка знаний', description: 'Тестирование по вопросам безопасности', order: 7, category: 'Общая' },
      { name: '8. Получение удостоверения', description: 'Удостоверение о проверке знаний', order: 8, category: 'Рабочие' },
      { name: '9. Карта КПЭиКП', description: 'Карта ключевых показателей для ИТР', order: 9, category: 'ИТР' }
    ];

    const stageRecords = {};
    for (const stage of stages) {
      const record = await prisma.onboardingStage.upsert({
        where: { name: stage.name },
        update: {},
        create: stage
      });
      stageRecords[stage.name] = record;
    }
    console.log('✅ Onboarding stages seeded');

    // Seed onboarding tasks with real company requirements
    const onboardingTasks = [
      // 1. Прохождение инструктажей
      { 
        title: 'Инструктаж по охране труда', 
        description: 'Обязательный инструктаж по охране труда', 
        stage: '1. Прохождение инструктажей', 
        category: 'Общая', 
        order: 1 
      },
      { 
        title: 'Инструктаж по пожарной безопасности', 
        description: 'Обязательный инструктаж по пожарной безопасности', 
        stage: '1. Прохождение инструктажей', 
        category: 'Общая', 
        order: 2 
      },
      { 
        title: 'Инструктаж по ГО', 
        description: 'Инструктаж по гражданской обороне', 
        stage: '1. Прохождение инструктажей', 
        category: 'Общая', 
        order: 3 
      },
      { 
        title: 'Первичный инструктаж на рабочем месте', 
        description: 'Инструктаж по безопасным методам работы на конкретном рабочем месте', 
        stage: '1. Прохождение инструктажей', 
        category: 'Общая', 
        order: 4 
      },

      // 2. Изучение инструкций
      { 
        title: 'Изучить инструкцию по охране труда', 
        description: 'Изучить инструкцию по охране труда (путь указан в письме)', 
        stage: '2. Изучение инструкций', 
        category: 'Общая', 
        order: 1 
      },
      { 
        title: 'Изучить инструкцию по пожарной безопасности', 
        description: 'Изучить инструкцию по пожарной безопасности', 
        stage: '2. Изучение инструкций', 
        category: 'Общая', 
        order: 2 
      },
      { 
        title: 'Изучить инструкции по ОТ и ПБ для должности', 
        description: 'Изучить инструкции по охране труда и пожарной безопасности для конкретной должности', 
        stage: '2. Изучение инструкций', 
        category: 'Общая', 
        order: 3 
      },

      // 3. Получение пропуска
      { 
        title: 'Получить пропуск на предприятие', 
        description: 'Оформить пропуск в отделе безопасности (указать где и у кого)', 
        stage: '3. Получение пропуска', 
        category: 'Общая', 
        order: 1 
      },

      // 4. Получение спецодежды (только для рабочих)
      { 
        title: 'Получить спецодежду', 
        description: 'Получить спецодежду в соответствии с нормами выдачи', 
        stage: '4. Получение спецодежды', 
        category: 'Рабочие', 
        order: 1 
      },

      // 5. Нормативная база
      { 
        title: 'Изучить коллективный договор', 
        description: 'Ознакомиться с коллективным договором предприятия', 
        stage: '5. Нормативная база', 
        category: 'Общая', 
        order: 1 
      },
      { 
        title: 'Изучить должностную инструкцию', 
        description: 'Ознакомиться с должностной инструкцией по занимаемой должности', 
        stage: '5. Нормативная база', 
        category: 'Общая', 
        order: 2 
      },
      { 
        title: 'Изучить методику оплаты', 
        description: 'Ознакомиться с методикой оплаты труда и премирования', 
        stage: '5. Нормативная база', 
        category: 'Общая', 
        order: 3 
      },

      // 6. Программа дублирования (только для рабочих)
      { 
        title: 'Пройти программу дублирования', 
        description: 'Пройти программу дублирования под руководством опытного работника', 
        stage: '6. Программа дублирования', 
        category: 'Рабочие', 
        order: 1 
      },

      // 7. Проверка знаний
      { 
        title: 'Пройти проверку знаний', 
        description: 'Ответить на вопросы по безопасности труда (документ с вопросами и ответами)', 
        stage: '7. Проверка знаний', 
        category: 'Общая', 
        order: 1 
      },

      // 8. Получение удостоверения (только для рабочих)
      { 
        title: 'Получить удостоверение о проверке знаний', 
        description: 'Получить удостоверение о проверке знаний и допуске к работе', 
        stage: '8. Получение удостоверения', 
        category: 'Рабочие', 
        order: 1 
      },

      // 9. Карта КПЭиКП (только для ИТР)
      { 
        title: 'Заполнить карту КПЭиКП', 
        description: 'Заполнить карту ключевых показателей эффективности и качества работы', 
        stage: '9. Карта КПЭиКП', 
        category: 'ИТР', 
        order: 1 
      }
    ];

    for (const task of onboardingTasks) {
      await prisma.task.upsert({
        where: { title: task.title },
        update: {},
        create: {
          title: task.title,
          description: task.description,
          stageId: stageRecords[task.stage].id,
          category: task.category,
          order: task.order,
          isGlobal: true
        }
      });
    }
    console.log('✅ Onboarding tasks with real company structure seeded');

    console.log('🎉 Reference data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding reference data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedReferenceData(); 