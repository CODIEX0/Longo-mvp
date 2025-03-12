import { Router } from 'express';
import SettingsController from '../controllers/SettingsController';
import { requireAdminSession } from '../middleware/adminMiddleware';

const router = Router();

router.put('/email', requireAdminSession, SettingsController.updateEmailSettings);
router.put('/google-cloud', requireAdminSession, SettingsController.updateGoogleCloudSettings);
router.put('/notifications', requireAdminSession, SettingsController.updateNotificationSettings);

export default router; 