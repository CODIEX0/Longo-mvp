import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  getDocs,
  deleteDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

class UserService {
  static async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const profileDoc = await getDoc(doc(db, 'userProfiles', userId));
      
      return {
        ...userDoc.data(),
        profile: profileDoc.exists() ? profileDoc.data() : null
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateUserProfile(userId, updateData) {
    try {
      const { name, email, ...profileData } = updateData;
      const batch = writeBatch(db);

      if (name || email) {
        const userRef = doc(db, 'users', userId);
        batch.update(userRef, {
          name: name || '',
          email: email || '',
          updatedAt: serverTimestamp()
        });
      }

      const profileRef = doc(db, 'userProfiles', userId);
      batch.update(profileRef, {
        avatar_url: profileData.avatar_url || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        preferences: profileData.preferences || '',
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async verifyServiceProvider(userId) {
    try {
      const query = `
        UPDATE users 
        SET 
          status = 'active',
          verified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND role = 'service_provider'
        RETURNING *
      `;
      const result = await db.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const query = `
        SELECT u.*, up.avatar_url, up.location
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        ORDER BY u.created_at DESC
      `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      await db.query('BEGIN');
      
      // Delete related records first
      await db.query('DELETE FROM points_history WHERE user_id = $1', [userId]);
      await db.query('DELETE FROM user_profiles WHERE user_id = $1', [userId]);
      
      // Delete the user
      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
      
      await db.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

export default UserService;