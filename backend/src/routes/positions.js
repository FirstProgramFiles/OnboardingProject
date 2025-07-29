const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middlewares/auth');
const {
  getAllPositions,
  createPosition,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');

// Get all positions (public)
router.get('/', getAllPositions);

// Admin only routes
router.post('/', authenticateToken, requireRole(['admin']), createPosition);
router.put('/:id', authenticateToken, requireRole(['admin']), updatePosition);
router.delete('/:id', authenticateToken, requireRole(['admin']), deletePosition);

module.exports = router; 