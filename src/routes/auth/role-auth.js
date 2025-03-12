import { Router } from 'express';
import FirebaseAuthService from '../../services/FirebaseAuthService';
import RoleAuthService from '../../services/RoleAuthService';
import { verifyAuth, requireRole } from '../../middleware/roleMiddleware';

const router = Router();

// Sign in with role-based token
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const firebaseUser = await FirebaseAuthService.signIn(email, password);
    const token = await RoleAuthService.generateAuthToken(firebaseUser);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Request service provider upgrade
router.post('/upgrade-provider', verifyAuth, requireRole('client'), async (req, res) => {
  try {
    await RoleAuthService.upgradeToServiceProvider(req.user.uid);
    res.json({ message: 'Upgrade request submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user permissions
router.get('/permissions', verifyAuth, async (req, res) => {
  try {
    const permissions = RoleAuthService.PERMISSIONS[req.user.role];
    res.json({ permissions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 