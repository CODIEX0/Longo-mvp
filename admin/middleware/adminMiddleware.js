import { verifyAdminSession } from '../services/adminAuth';

export const requireAdminSession = async (req, res, next) => {
  const sessionToken = req.headers["x-admin-token"];

  if (!sessionToken) {
    return res.status(401).json({ error: "Admin session token required" });
  }

  const isValidSession = await verifyAdminSession(sessionToken);
  
  if (!isValidSession) {
    return res.status(401).json({ error: "Admin session expired or invalid" });
  }

  next();
}; 