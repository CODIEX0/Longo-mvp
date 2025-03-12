import { Router } from 'express';
import FirebaseAuthService from '../../services/FirebaseAuthService';

const router = Router();

// Sign up with email verification
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const user = await FirebaseAuthService.signUp(email, password, name, role);
    res.json({ 
      message: 'Signup successful. Please check your email for verification.',
      userId: user.uid 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Request password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    await FirebaseAuthService.sendPasswordResetEmail(email);
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify password reset code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { code } = req.body;
    const email = await FirebaseAuthService.verifyPasswordReset(code);
    res.json({ email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete password reset
router.post('/confirm-reset', async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    await FirebaseAuthService.confirmPasswordReset(code, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await FirebaseAuthService.signIn(email, password);
    res.json({ 
      userId: user.uid,
      emailVerified: user.emailVerified 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 