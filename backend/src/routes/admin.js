const express = require('express');
const { getUserStats } = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Все эндпоинты требуют авторизации и прав администратора
router.use(authenticateToken, requireAdmin);

// GET /api/admin/stats
router.get('/stats', getUserStats);

module.exports = router; 