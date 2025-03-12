import RoleAuthService from '../services/RoleAuthService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const hasRole = await RoleAuthService.verifyRole(req.user.uid, role);
      if (!hasRole) {
        return res.status(403).json({ error: 'Insufficient role permissions' });
      }
      next();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  };
};

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await RoleAuthService.hasPermission(req.user.uid, permission);
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  };
}; 