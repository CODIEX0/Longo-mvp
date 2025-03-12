import { Router } from 'express';
import SubscriptionService from '../services/SubscriptionService';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Initialize subscription
router.post('/subscribe', verifyToken, async (req, res) => {
  try {
    const paymentDetails = await SubscriptionService.createSubscription(req.user.id);
    res.json(paymentDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check subscription status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const status = await SubscriptionService.checkSubscriptionStatus(req.user.id);
    res.json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get subscription history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await SubscriptionService.getRenewalHistory(req.user.id);
    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', verifyToken, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    await SubscriptionService.deactivateSubscription(req.user.id, subscriptionId);
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Get subscription metrics
router.get('/metrics', verifyToken, async (req, res) => {
  try {
    const metrics = await SubscriptionService.getSubscriptionMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 