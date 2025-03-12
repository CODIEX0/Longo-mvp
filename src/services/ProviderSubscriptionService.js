import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  writeBatch, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';

class ProviderSubscriptionService {
  static async createProviderSubscription(providerId, planData) {
    try {
      const batch = writeBatch(db);
      
      // Create subscription record
      const subscription = {
        providerId,
        planType: planData.type,
        status: 'active',
        features: planData.features,
        maxProjects: planData.maxProjects,
        maxBids: planData.maxBids,
        price: planData.price,
        billingCycle: planData.billingCycle,
        startDate: serverTimestamp(),
        endDate: new Date(Date.now() + planData.duration * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp()
      };

      const subscriptionRef = await addDoc(collection(db, 'providerSubscriptions'), subscription);

      // Update provider's profile
      const providerRef = doc(db, 'users', providerId);
      batch.update(providerRef, {
        subscriptionId: subscriptionRef.id,
        subscriptionStatus: 'active',
        subscriptionType: planData.type,
        remainingBids: planData.maxBids,
        updatedAt: serverTimestamp()
      });

      // Create billing record
      const billingRef = collection(db, 'billingHistory');
      batch.set(await addDoc(billingRef, {
        providerId,
        subscriptionId: subscriptionRef.id,
        amount: planData.price,
        status: 'paid',
        type: 'subscription',
        createdAt: serverTimestamp()
      }));

      await batch.commit();
      return { id: subscriptionRef.id, ...subscription };
    } catch (error) {
      throw error;
    }
  }

  static async getProviderSubscription(providerId) {
    try {
      const subscriptionsQuery = query(
        collection(db, 'providerSubscriptions'),
        where('providerId', '==', providerId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(subscriptionsQuery);
      return snapshot.empty ? null : {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateSubscriptionStatus(subscriptionId, status) {
    try {
      const subscriptionRef = doc(db, 'providerSubscriptions', subscriptionId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (!subscriptionDoc.exists()) {
        throw new Error('Subscription not found');
      }

      const batch = writeBatch(db);
      
      // Update subscription status
      batch.update(subscriptionRef, {
        status,
        updatedAt: serverTimestamp()
      });

      // Update provider's profile
      const providerRef = doc(db, 'users', subscriptionDoc.data().providerId);
      batch.update(providerRef, {
        subscriptionStatus: status,
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async decrementRemainingBids(providerId) {
    try {
      const providerRef = doc(db, 'users', providerId);
      const providerDoc = await getDoc(providerRef);
      
      if (!providerDoc.exists()) {
        throw new Error('Provider not found');
      }

      const userData = providerDoc.data();
      if (userData.remainingBids <= 0) {
        throw new Error('No remaining bids available');
      }

      await updateDoc(providerRef, {
        remainingBids: increment(-1),
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async renewSubscription(subscriptionId, newPlanData) {
    try {
      const batch = writeBatch(db);
      
      const subscriptionRef = doc(db, 'providerSubscriptions', subscriptionId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (!subscriptionDoc.exists()) {
        throw new Error('Subscription not found');
      }

      const oldSubscription = subscriptionDoc.data();

      // Create new subscription record
      const newSubscription = {
        providerId: oldSubscription.providerId,
        planType: newPlanData.type,
        status: 'active',
        features: newPlanData.features,
        maxProjects: newPlanData.maxProjects,
        maxBids: newPlanData.maxBids,
        price: newPlanData.price,
        billingCycle: newPlanData.billingCycle,
        startDate: serverTimestamp(),
        endDate: new Date(Date.now() + newPlanData.duration * 24 * 60 * 60 * 1000),
        previousSubscriptionId: subscriptionId,
        createdAt: serverTimestamp()
      };

      const newSubscriptionRef = await addDoc(collection(db, 'providerSubscriptions'), newSubscription);

      // Update old subscription
      batch.update(subscriptionRef, {
        status: 'expired',
        endDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update provider's profile
      const providerRef = doc(db, 'users', oldSubscription.providerId);
      batch.update(providerRef, {
        subscriptionId: newSubscriptionRef.id,
        subscriptionStatus: 'active',
        subscriptionType: newPlanData.type,
        remainingBids: newPlanData.maxBids,
        updatedAt: serverTimestamp()
      });

      // Create billing record
      const billingRef = collection(db, 'billingHistory');
      batch.set(await addDoc(billingRef, {
        providerId: oldSubscription.providerId,
        subscriptionId: newSubscriptionRef.id,
        amount: newPlanData.price,
        status: 'paid',
        type: 'renewal',
        createdAt: serverTimestamp()
      }));

      await batch.commit();
      return { id: newSubscriptionRef.id, ...newSubscription };
    } catch (error) {
      throw error;
    }
  }

  static async getBillingHistory(providerId) {
    try {
      const billingQuery = query(
        collection(db, 'billingHistory'),
        where('providerId', '==', providerId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(billingQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
}

export default ProviderSubscriptionService; 