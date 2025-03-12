import SettingsService from '../services/SettingsService';
import AdminService from '../services/AdminService';

class SettingsController {
  static async updateEmailSettings(req, res) {
    try {
      const settings = await SettingsService.saveEmailSettings(req.body);
      await AdminService.logAdminAction(req.user.id, 'update_email_settings', req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateGoogleCloudSettings(req, res) {
    try {
      const settings = await SettingsService.saveGoogleCloudSettings(req.body);
      await AdminService.logAdminAction(req.user.id, 'update_google_cloud_settings', req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateNotificationSettings(req, res) {
    try {
      const settings = await SettingsService.saveNotificationSettings(req.body);
      await AdminService.logAdminAction(req.user.id, 'update_notification_settings', req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default SettingsController; 