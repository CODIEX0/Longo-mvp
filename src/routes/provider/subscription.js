import { Router } from 'express';
import ProviderSubscriptionService from '../../services/ProviderSubscriptionService';
import { verifyAuth, requireRole } from '../../middleware/roleMiddleware';

const router = Router();

// Start free trial when upgrading to service provider
router.post('/trial/start', verifyAuth, requireRole('client'), async (req, res) => {
  try {
    await ProviderSubscriptionService.startFreeTrial(req.user.uid);
    res.json({ message: 'Free trial started successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Subscribe after trial
router.post('/subscribe', verifyAuth, requireRole('service_provider'), async (req, res) => {
  try {
    const { interval } = req.body;
    const paymentDetails = await ProviderSubscriptionService.createSubscription(
      req.user.uid,
      interval
    );
    res.json(paymentDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 