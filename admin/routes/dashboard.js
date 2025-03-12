import { Router } from 'express';
import AdminDashboardService from '../../services/AdminDashboardService';
import AdminReportService from '../../services/AdminReportService';
import { verifyToken, checkRole } from '../../src/middleware/authMiddleware';

const router = Router();
const adminAuth = [verifyToken, checkRole(['admin'])];

// Dashboard overview
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const metrics = await AdminDashboardService.getOverviewMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User management
router.get('/users/overview', adminAuth, async (req, res) => {
  try {
    const stats = await AdminDashboardService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Revenue tracking
router.get('/revenue', adminAuth, async (req, res) => {
  try {
    const stats = await AdminDashboardService.getRevenueStats();
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Report generation
router.post('/reports/generate', adminAuth, async (req, res) => {
  try {
    const { type, startDate, endDate, filters } = req.body;
    const report = await AdminReportService.generateReport(type, startDate, endDate, filters);
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 