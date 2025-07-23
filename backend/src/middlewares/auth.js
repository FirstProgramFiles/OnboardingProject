const { verifyToken } = require('../utils/auth');
const { prisma } = require('../utils/database');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

// Middleware to check if user has specific role
function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { role: true }
      });

      if (!user || user.role.name !== roleName) {
        return res.status(403).json({ 
          error: `Access denied. Role '${roleName}' required.` 
        });
      }

      req.userWithRole = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Middleware to check if user has admin role
function requireAdmin(req, res, next) {
  requireRole('admin')(req, res, next);
}

// Middleware to check if user has manager role
function requireManager(req, res, next) {
  requireRole('manager')(req, res, next);
}

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireManager
}; 