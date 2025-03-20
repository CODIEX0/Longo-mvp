import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';

class ServiceRequestService {
  // Create a new service request
  static async createServiceRequest(userId, requestData) {
    try {
      const request = {
        ...requestData,
        userId,
        status: 'open',
        bids: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'serviceRequests'), request);
      return { id: docRef.id, ...request };
    } catch (error) {
      throw error;
    }
  }

  // Get service requests for a specific user
  static async getUserServiceRequests(userId) {
    try {
      const q = query(
        collection(db, 'serviceRequests'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get all open service requests
  static async getOpenServiceRequests() {
    try {
      const q = query(
        collection(db, 'serviceRequests'),
        where('status', '==', 'open'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Add a bid to a service request
  static async addBidToRequest(requestId, bidData) {
    try {
      const requestRef = doc(db, 'serviceRequests', requestId);
      await updateDoc(requestRef, {
        bids: arrayUnion({
          ...bidData,
          status: 'pending',
          createdAt: serverTimestamp()
        })
      });
    } catch (error) {
      throw error;
    }
  }

  // Accept a bid for a service request
  static async acceptBid(requestId, bidId) {
    try {
      const requestRef = doc(db, 'serviceRequests', requestId);
      await updateDoc(requestRef, {
        status: 'in_progress',
        acceptedBid: bidId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }

  // Complete a service request
  static async completeServiceRequest(requestId) {
    try {
      const requestRef = doc(db, 'serviceRequests', requestId);
      await updateDoc(requestRef, {
        status: 'completed',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }
}

export default ServiceRequestService; 