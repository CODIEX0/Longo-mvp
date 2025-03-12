import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp, 
  writeBatch 
} from 'firebase/firestore';

class SubscriptionService {
  static async createSubscription(userId, planId, paymentMethod) {
    try {
      const batch = writeBatch(db);
      
      const subscription = {
        userId,
        planId,
        status: 'active',
        startDate: serverTimestamp(),
        endDate: null,
        paymentMethod,
        createdAt: serverTimestamp()
      };

      const subscriptionRef = await addDoc(collection(db, 'subscriptions'), subscription);
      
      // Update user's subscription status
      const userRef = doc(db, 'users', userId);
      batch.update(userRef, {
        subscriptionId: subscriptionRef.id,
        subscriptionStatus: 'active',
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return { id: subscriptionRef.id, ...subscription };
    } catch (error) {
      throw error;
    }
  }

  static async cancelSubscription(subscriptionId) {
    try {
      const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (!subscriptionDoc.exists()) {
        throw new Error('Subscription not found');
      }

      const batch = writeBatch(db);
      
      batch.update(subscriptionRef, {
        status: 'cancelled',
        endDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const userRef = doc(db, 'users', subscriptionDoc.data().userId);
      batch.update(userRef, {
        subscriptionStatus: 'cancelled',
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default SubscriptionService; 