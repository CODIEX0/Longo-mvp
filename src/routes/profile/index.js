import { Router } from 'express';
import multer from 'multer';
import ProfileManagementService from '../../services/ProfileManagementService';
import { verifyAuth } from '../../middleware/roleMiddleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get user profile
router.get('/', verifyAuth, async (req, res) => {
  try {
    const profile = await ProfileManagementService.getFullProfile(req.user.uid);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update profile
router.put('/', verifyAuth, async (req, res) => {
  try {
    const profile = await ProfileManagementService.updateProfile(
      req.user.uid,
      req.body
    );
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload profile image
router.post('/image', verifyAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) throw new Error('No image file provided');
    
    const imageUrl = await ProfileManagementService.uploadProfileImage(
      req.user.uid,
      req.file.buffer
    );
    res.json({ imageUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete profile
router.delete('/', verifyAuth, async (req, res) => {
  try {
    await ProfileManagementService.deleteProfile(req.user.uid);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 