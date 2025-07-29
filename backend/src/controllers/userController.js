const { prisma } = require('../utils/database');
const { processAvatar, isImage } = require('../utils/imageProcessor');
const { hashPassword, comparePassword } = require('../utils/auth');

// Get all users (admin only)
async function getAllUsers(req, res) {
  try {
    // Параметры пагинации
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Фильтры
    const fio = req.query.fio?.trim().toLowerCase();
    const email = req.query.email?.trim().toLowerCase();
    const role = req.query.role;
    const createdAt = req.query.createdAt;
    const updatedAt = req.query.updatedAt;

    // Сортировка
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    // Формируем where для Prisma
    const where = {};
    if (fio) {
      where.OR = [
        { firstName: { contains: fio, mode: 'insensitive' } },
        { lastName: { contains: fio, mode: 'insensitive' } },
        { middleName: { contains: fio, mode: 'insensitive' } },
      ];
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (role) {
      where.role = { name: role };
    }
    if (createdAt) {
      where.createdAt = { gte: new Date(createdAt + 'T00:00:00'), lt: new Date(createdAt + 'T23:59:59') };
    }
    if (updatedAt) {
      where.updatedAt = { gte: new Date(updatedAt + 'T00:00:00'), lt: new Date(updatedAt + 'T23:59:59') };
    }

    // Формируем orderBy
    let orderBy = undefined;
    if (sortBy) {
      orderBy = { [sortBy]: sortOrder };
    }

    // Получить пользователей с фильтрами, сортировкой и пагинацией
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { role: true },
        orderBy: orderBy || { createdAt: 'desc' },
      }),
      prisma.user.count({ where })
    ]);

    res.json({ users, total, page, limit });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get user by ID (admin/manager only)
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        role: true,
        departmentRef: true,
        positionRef: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update user role (admin only)
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { name: roleName }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { roleId: role.id },
      include: {
        role: true
      },
      select: {
        id: true,
        email: true,
        role: true,
        // Exclude password
      }
    });

    res.json({ 
      message: 'User role updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all roles
async function getAllRoles(req, res) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    res.json({ roles });

  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete user (admin only)
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    // Удалить связанные UserTask
    await prisma.userTask.deleteMany({ where: { userId: parseInt(id) } });
    // Удалить пользователя
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Пользователь успешно удалён' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PATCH /api/users/:id/avatar
async function updateUserAvatar(req, res) {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    const isValidImage = await isImage(req.file.buffer);
    if (!isValidImage) {
      return res.status(400).json({ error: 'Загруженный файл не является изображением' });
    }
    const avatar = await processAvatar(req.file.buffer, { width: 200, height: 200, quality: 80 });
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { avatar }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Получение аватара пользователя
async function getUserAvatar(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { avatar: true }
    });
    if (!user || !user.avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    // Приводим к Buffer
    const buffer = Buffer.from(user.avatar);
    console.log('typeof user.avatar:', typeof user.avatar, 'isBuffer:', Buffer.isBuffer(buffer));
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update user (admin only)
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      middleName, 
      email, 
      phone, 
      positionId, 
      departmentId, 
      roleName,
      oldPassword,
      newPassword
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !middleName || !email || !positionId || !departmentId || !roleName) {
      return res.status(400).json({ 
        error: 'All required fields must be provided' 
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    const emailConflict = await prisma.user.findFirst({
      where: {
        email,
        id: { not: parseInt(id) }
      }
    });

    if (emailConflict) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Validate position exists
    const position = await prisma.position.findUnique({
      where: { id: parseInt(positionId) }
    });

    if (!position) {
      return res.status(400).json({ error: 'Selected position does not exist' });
    }

    // Validate department exists
    const department = await prisma.department.findUnique({
      where: { id: parseInt(departmentId) }
    });

    if (!department) {
      return res.status(400).json({ error: 'Selected department does not exist' });
    }

    // Get role by name
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

    if (!role) {
      return res.status(400).json({ error: 'Selected role does not exist' });
    }

    // Prepare update data
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleName: middleName.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      positionId: parseInt(positionId),
      departmentId: parseInt(departmentId),
      roleId: role.id,
      // Keep for backward compatibility
      position: position.name,
      department: department.name
    };

    // Смена пароля
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Новый пароль должен содержать минимум 6 символов' });
      }
      updateData.password = await hashPassword(newPassword);
    }

    // Process avatar if provided
    if (req.file) {
      try {
        const avatarBuffer = await processAvatar(req.file.buffer, { width: 200, height: 200, quality: 80 });
        updateData.avatar = avatarBuffer;
      } catch (avatarErr) {
        console.error('Avatar processing error:', avatarErr);
        return res.status(400).json({ error: 'Invalid avatar file' });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        role: true,
        positionRef: true,
        departmentRef: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            position: true,
            department: true
          }
        }
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Получить статистику пользователей (для админ-панели)
async function getUserStats(req, res) {
  try {
    // Если есть поле isActive, используйте его. Если нет — считаем всех активными.
    const totalUsers = await prisma.user.count();
    let activeUsers = totalUsers;
    // Если поле isActive есть в модели, раскомментируйте строку ниже:
    // const activeUsers = await prisma.user.count({ where: { isActive: true } });
    res.json({ totalUsers, activeUsers });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PATCH /api/users/:id/has-seen-welcome
async function setHasSeenWelcome(req, res) {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    // Только сам пользователь или админ
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { hasSeenWelcome: true },
      select: { id: true, hasSeenWelcome: true }
    });
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('setHasSeenWelcome error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  getAllRoles,
  deleteUser,
  updateUserAvatar,
  getUserAvatar,
  getUserStats,
  setHasSeenWelcome
}; 