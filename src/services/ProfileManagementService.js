import { db } from '../firebase';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

class ProfileManagementService {
  static async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.data();
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileManagementService; 