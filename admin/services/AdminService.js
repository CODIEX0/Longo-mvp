import db from '../database/db.js';
import { format } from 'date-fns';

class AdminService {
  static async getDashboardMetrics() {
    try {
      const thirtyDaysAgo = format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd');

      const query = `
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE created_at >= $1) as new_users,
          (SELECT COUNT(*) FROM tasks WHERE created_at >= $1) as new_tasks,
          (SELECT COUNT(*) FROM payments WHERE created_at >= $1) as new_payments
        FROM users LIMIT 1;
      `;

      const result = await db.query(query, [thirtyDaysAgo]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async logAdminAction(adminId, action, details) {
    try {
      const query = `
        INSERT INTO audit_logs (admin_id, action, details)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const result = await db.query(query, [adminId, action, details]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAuditLog(startDate, endDate) {
    try {
      const query = `
        SELECT * FROM audit_logs 
        WHERE timestamp BETWEEN $1 AND $2
        ORDER BY timestamp DESC;
      `;

      const result = await db.query(query, [startDate, endDate]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

export default AdminService; 