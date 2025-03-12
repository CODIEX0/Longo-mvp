import express from 'express';
import {
  getAllUsers,
  getUserById,
  generateReport,
  handleSignupApproval,
  getAllPayments,
  updatePaymentStatus,
} from '../controllers/adminController';

const router = express.Router();

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);

// Report routes
router.get('/reports', generateReport);

// Signup approval routes
router.post('/signup-approval', handleSignupApproval);

// Payment management routes
router.get('/payments', getAllPayments);
router.put('/payments/:paymentId', updatePaymentStatus);

export default router;
