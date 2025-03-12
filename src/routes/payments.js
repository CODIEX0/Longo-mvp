import { Router } from 'express';
import PaymentService from '../services/PaymentService';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Initialize subscription payment
router.post('/subscribe', verifyToken, async (req, res) => {
  try {
    const paymentDetails = await PaymentService.createSubscription(req.user.id);
    res.json(paymentDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PayFast notification webhook
router.post('/notify', async (req, res) => {
  try {
    await PaymentService.handleNotification(req.body);
    res.status(200).send('OK');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment success route
router.get('/success', verifyToken, (req, res) => {
  res.json({ message: 'Payment successful' });
});

// Payment cancel route
router.get('/cancel', verifyToken, (req, res) => {
  res.json({ message: 'Payment cancelled' });
});

export default router; 