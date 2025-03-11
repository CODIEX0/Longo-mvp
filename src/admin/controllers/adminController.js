const client = require('../../database/postgres');

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Generate reports
export const generateReport = async (req, res) => {
  try {
    const tasksRef = db.ref('tasks');
    const snapshot = await tasksRef.once('value');
    const tasks = snapshot.val();
    const report = {
      totalTasks: Object.keys(tasks).length,
      completedTasks: Object.values(tasks).filter(task => task.completed).length,
    };
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Approve or reject signup
export const handleSignupApproval = async (req, res) => {
  const { userId, status } = req.body;
  try {
    await client.query('UPDATE users SET status = $1 WHERE id = $2', [status, userId]);
    res.status(200).json({ message: `Signup ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update signup status' });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM payments');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  const { paymentId, status } = req.body;
  try {
    await client.query('UPDATE payments SET status = $1 WHERE id = $2', [status, paymentId]);
    res.status(200).json({ message: `Payment status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
