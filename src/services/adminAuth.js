import { supabase } from '../supabase';

// Default admin credentials (temporary)
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123", // This should be changed after first login
  sessionDuration: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
};

export const adminSignIn = async (username, password) => {
  try {
    // Check against default credentials
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      // Create a session token
      const sessionToken = Math.random().toString(36).substring(2);
      const expiresAt = new Date(Date.now() + DEFAULT_ADMIN.sessionDuration);

      // Store session in Supabase
      const { data, error } = await supabase
        .from("admin_sessions")
        .insert([
          {
            session_token: sessionToken,
            expires_at: expiresAt,
            is_active: true
          }
        ]);

      if (error) throw error;

      return {
        sessionToken,
        expiresAt,
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
    const { data, error } = await supabase
      .from("admin_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .eq("is_active", true)
      .single();

    if (error) throw error;

    // Check if session has expired
    if (new Date(data.expires_at) < new Date()) {
      await invalidateSession(sessionToken);
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Invalidate session
export const invalidateSession = async (sessionToken) => {
  try {
    const { error } = await supabase
      .from("admin_sessions")
      .update({ is_active: false })
      .eq("session_token", sessionToken);

    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
}; 