import { Router } from 'express';
import { adminSignIn, invalidateSession } from '../services/adminAuth';
import { requireAdminSession } from '../middleware/adminMiddleware';
import AdminService from '../services/AdminService';
import { verifyToken, checkRole } from '../../src/middleware/authMiddleware';

const router = Router();

// Middleware to verify admin access
const adminAuth = [verifyToken, checkRole(['admin'])];

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

// Dashboard metrics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const metrics = await AdminService.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate reports
router.post('/reports', adminAuth, async (req, res) => {
  try {
    const { reportType, startDate, endDate, filters } = req.body;
    const report = await AdminService.generateReport(reportType, startDate, endDate, filters);
    
    // Log report generation
    await AdminService.logAdminAction(req.user.id, 'generate_report', { reportType, startDate, endDate });
    
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get audit logs
router.get('/audit-logs', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await AdminService.getAuditLog(startDate, endDate);
    res.json(logs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User management endpoints
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await AdminService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 