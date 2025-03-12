import db from '../database/db.js';

class SettingsService {
  static async saveEmailSettings(settings) {
    try {
      const query = `
        INSERT INTO admin_settings (type, settings)
        VALUES ('email', $1)
        ON CONFLICT (type) 
        DO UPDATE SET settings = $1, updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;

      const values = [{
        defaultSenderEmail: settings.defaultSenderEmail,
        smtpServer: settings.smtpServer,
        smtpPort: settings.port,
        recipient: settings.recipient
      }];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async saveGoogleCloudSettings(settings) {
    try {
      const query = `
        INSERT INTO admin_settings (type, settings)
        VALUES ('google_cloud', $1)
        ON CONFLICT (type) 
        DO UPDATE SET settings = $1, updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;

      const values = [{
        apiKey: settings.apiKey,
        mapsApiKey: settings.mapsApiKey
      }];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async saveNotificationSettings(settings) {
    try {
      const query = `
        INSERT INTO admin_settings (type, settings)
        VALUES ('notifications', $1)
        ON CONFLICT (type) 
        DO UPDATE SET settings = $1, updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;

      const values = [{
        enabled: settings.enabled,
        defaultMessage: settings.message
      }];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getSettings(type) {
    try {
      const query = 'SELECT * FROM admin_settings WHERE type = $1';
      const result = await db.query(query, [type]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default SettingsService; 