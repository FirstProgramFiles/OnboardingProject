const { prisma } = require('../utils/database');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { processAvatar } = require('../utils/imageProcessor');

// Register new user
async function register(req, res) {
  try {
    const { 
      email, 
      password, 
      firstName,
      lastName,
      middleName,
      positionId,
      departmentId,
      phone,
      roleName = 'employee' 
    } = req.body;

    // Validate required input
    if (!email || !password || !firstName || !lastName || !positionId) {
      return res.status(400).json({ 
        error: 'Email, password, first name, last name, and position are required' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Пользователь с таким email уже существует' 
      });
    }

    // Validate position exists
    const position = await prisma.position.findUnique({
      where: { id: parseInt(positionId) }
    });

    if (!position) {
      return res.status(400).json({ 
        error: 'Selected position does not exist' 
      });
    }

    // Validate department exists if provided
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(departmentId) }
      });

      if (!department) {
        return res.status(400).json({ 
          error: 'Selected department does not exist' 
        });
      }
    }

    // Get or create role
    let role = await prisma.role.findUnique({
      where: { name: roleName }
    });

    if (!role) {
      // Create default roles if they don't exist
      const defaultRoles = ['admin', 'manager', 'employee'];
      for (const roleName of defaultRoles) {
        await prisma.role.upsert({
          where: { name: roleName },
          update: {},
          create: { name: roleName }
        });
      }
      
      role = await prisma.role.findUnique({
        where: { name: roleName }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Обработка аватара, если есть
    let avatarBuffer = null;
    if (req.file) {
      try {
        avatarBuffer = await processAvatar(req.file.buffer, { width: 200, height: 200, quality: 80 });
      } catch (avatarErr) {
        // Ошибка обработки аватара — не прерываем регистрацию
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        position: position.name, // Keep for backward compatibility
        department: departmentId ? (await prisma.department.findUnique({ where: { id: parseInt(departmentId) } })).name : null,
        phone,
        roleId: role.id,
        positionId: parseInt(positionId),
        departmentId: departmentId ? parseInt(departmentId) : null,
        avatar: avatarBuffer,
      },
      include: {
        role: true,
        positionRef: true,
        departmentRef: true
      }
    });

    // Автоматически создать UserTask для всех глобальных задач
    const globalTasks = await prisma.task.findMany({ where: { isGlobal: true } });
    console.log('Создаю задачи для пользователя', user.id, 'Количество задач:', globalTasks.length);
    await Promise.all(globalTasks.map(task =>
      prisma.userTask.create({
        data: {
          userId: user.id,
          taskId: task.id,
          status: 'pending'
        }
      }).catch(e => console.error('Ошибка создания UserTask:', e, 'taskId:', task.id, 'userId:', user.id))
    ));

    // Generate token
    const token = generateToken(user.id, user.roleId);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Login user
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    // Generate token
    const token = generateToken(user.id, user.roleId);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get current user profile
async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { role: true, manager: { include: { positionRef: true, departmentRef: true } } }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Добавить данные о руководителе
    let managerInfo = null;
    if (user.manager) {
      managerInfo = {
        id: user.manager.id,
        firstName: user.manager.firstName,
        lastName: user.manager.lastName,
        middleName: user.manager.middleName,
        email: user.manager.email,
        position: user.manager.positionRef ? user.manager.positionRef.name : user.manager.position,
        department: user.manager.departmentRef ? user.manager.departmentRef.name : user.manager.department
      };
    }

    res.json({ user: { ...userWithoutPassword, manager: managerInfo } });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  getProfile
}; 