import { db } from '../firebase';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

class BidService {
  static async createBid(projectId, userId, bidData) {
    try {
      const bid = {
        ...bidData,
        projectId,
        userId,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'bids'), bid);
      return { id: docRef.id, ...bid };
    } catch (error) {
      throw error;
    }
  }

  static async getProjectBids(projectId) {
    try {
      const bidsQuery = query(
        collection(db, 'bids'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(bidsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
}

export default BidService; 