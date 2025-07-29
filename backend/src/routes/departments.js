const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middlewares/auth');
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// Get all departments (public)
router.get('/', getAllDepartments);

// Admin only routes
router.post('/', authenticateToken, requireRole(['admin']), createDepartment);
router.put('/:id', authenticateToken, requireRole(['admin']), updateDepartment);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteDepartment);

module.exports = router; 