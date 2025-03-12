import { Router } from 'express';
import AuthService from '../services/AuthService';

const router = Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const token = await AuthService.signUp(email, password, name, role);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await AuthService.signIn(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Password reset request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    await AuthService.resetPassword(email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const { error } = await supabase.auth.verifyOtp({ token_hash: token });
    if (error) throw error;
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 