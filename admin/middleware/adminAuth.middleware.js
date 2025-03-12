import { verifyAdminSession } from '../services/adminAuth';
import RoleAuthService from '../../src/services/RoleAuthService';

export const requireAdminAuth = async (req, res, next) => {
  const sessionToken = req.headers["x-admin-token"];

  if (!sessionToken) {
    return res.status(401).json({ error: "Admin session token required" });
  }

  const isValidSession = await verifyAdminSession(sessionToken);
  const hasAdminRole = await RoleAuthService.verifyRole(req.user.uid, 'admin');
  
  if (!isValidSession || !hasAdminRole) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  next();
}; 