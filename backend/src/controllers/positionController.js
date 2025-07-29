const { prisma } = require('../utils/database');

// Get all positions
async function getAllPositions(req, res) {
  try {
    const positions = await prisma.position.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({ positions });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create new position
async function createPosition(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Position name is required' });
    }

    const existingPosition = await prisma.position.findUnique({
      where: { name }
    });

    if (existingPosition) {
      return res.status(409).json({ error: 'Position with this name already exists' });
    }

    const position = await prisma.position.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json({
      message: 'Position created successfully',
      position
    });

  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update position
async function updatePosition(req, res) {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Position name is required' });
    }

    const existingPosition = await prisma.position.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPosition) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Check if name is already taken by another position
    const nameConflict = await prisma.position.findFirst({
      where: {
        name,
        id: { not: parseInt(id) }
      }
    });

    if (nameConflict) {
      return res.status(409).json({ error: 'Position with this name already exists' });
    }

    const position = await prisma.position.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        isActive: isActive !== undefined ? isActive : existingPosition.isActive
      }
    });

    res.json({
      message: 'Position updated successfully',
      position
    });

  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete position
async function deletePosition(req, res) {
  try {
    const { id } = req.params;

    const position = await prisma.position.findUnique({
      where: { id: parseInt(id) },
      include: { users: true }
    });

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    if (position.users.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete position with active users' 
      });
    }

    await prisma.position.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Position deleted successfully' });

  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllPositions,
  createPosition,
  updatePosition,
  deletePosition
}; 