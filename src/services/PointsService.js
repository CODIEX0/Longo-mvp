import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  increment, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { writeBatch } from 'firebase/firestore';

class PointsService {
  static POINTS_CONFIG = {
    TASK_COMPLETION: 10,
    RATING_MULTIPLIER: 2,
    STREAK_BONUS: 5,
    MONTHLY_RESET: false
  };

  static async awardPoints(userId, action, rating = 5) {
    try {
      // Get current user points
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('points, tasks_completed, current_streak')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Calculate points based on action
      let pointsToAward = this.calculatePoints(action, rating, user.current_streak);

      // Update user points and stats
      const { error: updateError } = await supabase
        .from('users')
        .update({
          points: (user.points || 0) + pointsToAward,
          tasks_completed: (user.tasks_completed || 0) + 1,
          current_streak: this.updateStreak(user.current_streak)
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log points transaction
      await this.logPointsTransaction(userId, pointsToAward, action);

      return pointsToAward;
    } catch (error) {
      throw error;
    }
  }

  static calculatePoints(action, rating, streak) {
    let points = 0;
    switch (action) {
      case 'task_completion':
        points = this.POINTS_CONFIG.TASK_COMPLETION;
        points *= (rating / 5) * this.POINTS_CONFIG.RATING_MULTIPLIER;
        break;
      // Add more action types here
    }

    // Add streak bonus
    if (streak > 0) {
      points += this.POINTS_CONFIG.STREAK_BONUS * Math.min(streak, 5);
    }

    return Math.round(points);
  }

  static updateStreak(currentStreak) {
    const lastActivity = new Date(currentStreak?.lastUpdate || 0);
    const today = new Date();
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      return currentStreak + 1;
    } else if (daysDiff > 1) {
      return 1;
    }
    return currentStreak;
  }

  static async getLeaderboard(timeframe = 'all') {
    try {
      let query = supabase
        .from('users')
        .select('id, name, points, tasks_completed, current_streak')
        .order('points', { ascending: false })
        .limit(100);

      if (timeframe === 'monthly') {
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        query = query.gte('updated_at', firstDayOfMonth.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getUserRank(userId) {
    try {
      const { data: userPoints, error: userError } = await supabase
        .from('users')
        .select('points')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { count, error: rankError } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gt('points', userPoints.points);

      if (rankError) throw rankError;

      return count + 1; // Add 1 to get actual rank
    } catch (error) {
      throw error;
    }
  }

  static async logPointsTransaction(userId, points, action) {
    try {
      const { error } = await supabase
        .from('points_history')
        .insert([{
          user_id: userId,
          points,
          action,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  static async addPoints(userId, points, reason) {
    try {
      const batch = writeBatch(db);
      const userRef = doc(db, 'users', userId);
      
      // Update user's total points
      batch.update(userRef, {
        points: increment(points),
        updatedAt: serverTimestamp()
      });

      // Add points history record
      const historyRef = collection(db, 'pointsHistory');
      batch.set(await addDoc(historyRef, {
        userId,
        points,
        reason,
        createdAt: serverTimestamp()
      }));

      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getPointsHistory(userId) {
    try {
      const historyQuery = query(
        collection(db, 'pointsHistory'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(historyQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
}

export default PointsService; 