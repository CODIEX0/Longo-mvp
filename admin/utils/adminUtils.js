// Utility function to format user data
export const formatUserData = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
    createdAt: user.createdAt,
  };
};

// Utility function to calculate analytics
export const calculateAnalytics = (data) => {
  const totalUsers = Object.keys(data.users).length;
  const activeUsers = Object.values(data.users).filter(user => user.isActive).length;
  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
  };
}; 

// Validate signup status
export const validateSignupStatus = (status) => {
    const validStatuses = ['approved', 'rejected'];
    return validStatuses.includes(status);
  };
  
  // Validate payment status
  export const validatePaymentStatus = (status) => {
    const validStatuses = ['completed', 'pending', 'failed'];
    return validStatuses.includes(status);
  };