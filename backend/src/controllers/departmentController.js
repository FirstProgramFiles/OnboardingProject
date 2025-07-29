const { prisma } = require('../utils/database');

// Get all departments
async function getAllDepartments(req, res) {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({ departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create new department
async function createDepartment(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    const existingDepartment = await prisma.department.findUnique({
      where: { name }
    });

    if (existingDepartment) {
      return res.status(409).json({ error: 'Department with this name already exists' });
    }

    const department = await prisma.department.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json({
      message: 'Department created successfully',
      department
    });

  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update department
async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    const existingDepartment = await prisma.department.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Check if name is already taken by another department
    const nameConflict = await prisma.department.findFirst({
      where: {
        name,
        id: { not: parseInt(id) }
      }
    });

    if (nameConflict) {
      return res.status(409).json({ error: 'Department with this name already exists' });
    }

    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        isActive: isActive !== undefined ? isActive : existingDepartment.isActive
      }
    });

    res.json({
      message: 'Department updated successfully',
      department
    });

  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete department
async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id: parseInt(id) },
      include: { users: true }
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    if (department.users.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete department with active users' 
      });
    }

    await prisma.department.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Department deleted successfully' });

  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
}; 