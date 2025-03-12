import { db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

class RoleAuthService {
  static async checkUserRole(userId, requiredRole) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      return userData.role === requiredRole;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserRole(userId, newRole) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        roleUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getRolePermissions(role) {
    try {
      const roleDoc = await getDoc(doc(db, 'roles', role));
      return roleDoc.exists() ? roleDoc.data().permissions : [];
    } catch (error) {
      throw error;
    }
  }
}

export default RoleAuthService; 