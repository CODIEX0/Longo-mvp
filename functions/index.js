const { onCall, onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { Client } = require('pg');  // PostgreSQL client
const { createClient } = require('@supabase/supabase-js'); //Supabase client
const logger = require('firebase-functions/logger');

// Initialize Firebase Admin SDK
initializeApp();

// Initialize Firestore
const db = getFirestore();

// Initialize PostgreSQL client
const pgClient = new Client({
  user: "your_db_user",
  host: "localhost",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432,
});

pgClient.connect()
  .then(() => logger.info("Connected to PostgreSQL"))
  .catch((err) => logger.error("PostgreSQL connection error", err));

// Initialize Supabase client (make sure to replace with your actual URL and key)
const supabase = createClient('https://your-project-id.supabase.co', 'your-anon-key');

// Get user data
exports.getUserData = onRequest(async (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  try {
    const result = await pgClient.query("SELECT * FROM users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    logger.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

// List all users
exports.listUsers = onCall(async (request) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    logger.error('Error listing users:', error);
    throw new onCall.HttpsError('internal', 'Failed to list users');
  }
});

// Update user role
exports.updateUserRole = onCall(async (request) => {
  const { userId, role } = request.data;

  if (!userId || !role) {
    throw new onCall.HttpsError('invalid-argument', 'User ID and role are required');
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    logger.error('Error updating user role:', error);
    throw new onCall.HttpsError('internal', 'Failed to update user role');
  }
});

// Delete a user
exports.deleteUser = onCall(async (request) => {
  const { userId } = request.data;

  if (!userId) {
    throw new onCall.HttpsError('invalid-argument', 'User ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw new onCall.HttpsError('internal', 'Failed to delete user');
  }
});

// Generate user activity report
exports.userActivityReport = onCall(async (request) => {
  const { startDate, endDate } = request.data;

  if (!startDate || !endDate) {
    throw new onCall.HttpsError('invalid-argument', 'Start date and end date are required');
  }

  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    logger.error('Error generating user activity report:', error);
    throw new onCall.HttpsError('internal', 'Failed to generate user activity report');
  }
});

// Generate task completion report
exports.taskCompletionReport = onCall(async (request) => {
  const { startDate, endDate } = request.data;

  if (!startDate || !endDate) {
    throw new onCall.HttpsError('invalid-argument', 'Start date and end date are required');
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('completed_at', startDate)
      .lte('completed_at', endDate);

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    logger.error('Error generating task completion report:', error);
    throw new onCall.HttpsError('internal', 'Failed to generate task completion report');
  }
});

// Get user growth over time
exports.userGrowthAnalytics = onCall(async (request) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    logger.error('Error fetching user growth analytics:', error);
    throw new onCall.HttpsError('internal', 'Failed to fetch user growth analytics');
  }
});

// Get task completion rate
exports.taskCompletionRate = onCall(async (request) => {
  try {
    const { count: totalTasksCount, error: totalError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' });

    const { count: completedTasksCount, error: completedError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .not('completed_at', 'is', null);

    if (totalError || completedError) {
      throw new Error(totalError?.message || completedError?.message);
    }

    const completionRate = (completedTasksCount / totalTasksCount) * 100;
    return { completionRate };
  } catch (error) {
    logger.error('Error calculating task completion rate:', error);
    throw new onCall.HttpsError('internal', 'Failed to calculate task completion rate');
  }
});

