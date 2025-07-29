const express = require('express');
const { 
  getAllUsers, 
  getUserById, 
  updateUser,
  updateUserRole, 
  getAllRoles, 
  deleteUser, 
  updateUserAvatar, 
  getUserAvatar, 
  getUserStats, // добавляем функцию
  setHasSeenWelcome
} = require('../controllers/userController');
const { 
  authenticateToken, 
  requireAdmin, 
  requireManager 
} = require('../middlewares/auth');
const taskController = require('../controllers/taskController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Публичный эндпоинт для аватара
router.get('/:id/avatar', getUserAvatar);

// Все остальные требуют авторизации
router.use(authenticateToken);

// Get all users (admin only)
router.get('/', requireAdmin, getAllUsers);

// Get all roles (authenticated users)
router.get('/roles/all', getAllRoles);

// Получить все задачи текущего пользователя
router.get('/me/tasks', authenticateToken, taskController.getMyTasks);

// Обновить статус задачи пользователя
router.patch('/me/tasks/:id', authenticateToken, taskController.updateTaskStatus);

// Обновить статус задачи этапа для текущего пользователя
router.patch('/me/tasks/:id', authenticateToken, taskController.updateUserTaskStatus);

// PATCH user avatar (authenticated user)
router.patch('/:id/avatar', upload.single('avatar'), updateUserAvatar);

// Update user (admin only)
router.patch('/:id', requireAdmin, upload.single('avatar'), updateUser);

// Get user by ID (admin/manager only)
router.get('/:id', requireAdmin, getUserById);

// Update user role (admin only)
router.patch('/:id/role', requireAdmin, updateUserRole);

// Delete user (admin only)
router.delete('/:id', requireAdmin, deleteUser);

// Получить этапы онбординга с задачами и прогрессом для текущего пользователя
router.get('/me/onboarding', authenticateToken, taskController.getOnboardingStagesWithTasksAndProgress);

// PATCH hasSeenWelcome (authenticated user or admin)
router.patch('/:id/has-seen-welcome', authenticateToken, setHasSeenWelcome);

module.exports = router; 