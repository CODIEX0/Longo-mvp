import db from '../database/db.js';
import bcrypt from 'bcrypt';

// Default admin credentials (temporary)
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123", // This should be changed after first login
  sessionDuration: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
};

export const adminSignIn = async (username, password) => {
  try {
    // For initial setup only - should be removed in production
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const sessionToken = Math.random().toString(36).substring(2);
      const expiresAt = new Date(Date.now() + DEFAULT_ADMIN.sessionDuration);

      const query = `
        INSERT INTO admin_sessions (session_token, admin_id, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const result = await db.query(query, [
        sessionToken,
        '00000000-0000-0000-0000-000000000000', // Default admin ID
        expiresAt
      ]);

      return {
        sessionToken: result.rows[0].session_token,
        expiresAt: result.rows[0].expires_at,
        isTemporary: true
      };
    }

    throw new Error("Invalid credentials");
  } catch (error) {
    throw error;
  }
};

// Verify admin session
export const verifyAdminSession = async (sessionToken) => {
  try {
    const query = `
      SELECT * FROM admin_sessions 
      WHERE session_token = $1 
      AND is_active = true 
      AND expires_at > CURRENT_TIMESTAMP;
    `;

    const result = await db.query(query, [sessionToken]);
    return result.rows.length > 0;
  } catch (error) {
    return false;
  }
};

// Invalidate session
export const invalidateSession = async (sessionToken) => {
  try {
    const query = `
      UPDATE admin_sessions 
      SET is_active = false 
      WHERE session_token = $1
      RETURNING *;
    `;

    const result = await db.query(query, [sessionToken]);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
}; 