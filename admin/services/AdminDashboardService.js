import { supabase } from '../../src/supabase';

class AdminDashboardService {
  static async getOverviewMetrics() {
    try {
      const [
        userStats,
        revenueStats,
        taskStats,
        providerStats
      ] = await Promise.all([
        this.getUserStats(),
        this.getRevenueStats(),
        this.getTaskStats(),
        this.getProviderStats()
      ]);

      return {
        users: userStats,
        revenue: revenueStats,
        tasks: taskStats,
        providers: providerStats,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserStats() {
    const { data, error } = await supabase
      .from('users')
      .select('role, status, created_at');

    if (error) throw error;

    return {
      totalUsers: data.length,
      activeUsers: data.filter(u => u.status === 'active').length,
      newUsersThisMonth: data.filter(u => {
        const created = new Date(u.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth();
      }).length,
      roleDistribution: data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {})
    };
  }

  static async getRevenueStats() {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('status', 'completed');

    if (error) throw error;

    const monthly = data.reduce((acc, payment) => {
      const month = new Date(payment.created_at).getMonth();
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    return {
      totalRevenue: data.reduce((sum, p) => sum + p.amount, 0),
      monthlyRevenue: monthly,
      averageTransactionValue: data.length ? 
        data.reduce((sum, p) => sum + p.amount, 0) / data.length : 0
    };
  }

  static async getTaskStats() {
    const { data, error } = await supabase
      .from('tasks')
      .select('status, rating, created_at');

    if (error) throw error;

    return {
      totalTasks: data.length,
      completedTasks: data.filter(t => t.status === 'completed').length,
      averageRating: data.reduce((sum, t) => sum + (t.rating || 0), 0) / data.length,
      tasksByStatus: data.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

export default AdminDashboardService; 