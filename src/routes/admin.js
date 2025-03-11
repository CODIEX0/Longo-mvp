import { Router } from 'express';
import { adminSignIn, invalidateSession } from '../services/adminAuth';
import { requireAdminSession } from '../middleware/adminMiddleware';

const router = Router();

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const session = await adminSignIn(username, password);
    
    res.json({
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
      isTemporary: session.isTemporary
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Admin logout
router.post("/logout", requireAdminSession, async (req, res) => {
  try {
    const sessionToken = req.headers["x-admin-token"];
    await invalidateSession(sessionToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected admin routes
router.get("/dashboard", requireAdminSession, (req, res) => {
  res.json({ message: "Admin dashboard access granted" });
});

export default router; 