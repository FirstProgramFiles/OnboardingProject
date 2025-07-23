const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const taskController = require('../controllers/taskController');

// Получить этапы онбординга с задачами и прогрессом для текущего пользователя
router.get('/stages', authenticateToken, taskController.getOnboardingStagesWithTasksAndProgress);

// Обновить статус задачи этапа для текущего пользователя
router.patch('/tasks/:id/status', authenticateToken, taskController.updateUserTaskStatus);

module.exports = router; 