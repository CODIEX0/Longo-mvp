import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  setDoc, 
  arrayUnion,
  serverTimestamp 
} from '@firebase/firestore';
import { db } from '../firebase';

export const createProfile = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const getProfile = (userId) => db.collection('profiles').doc(userId).get();

export const updateProfile = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const createTask = (data) => db.collection('tasks').add(data);
export const getTasks = () => db.collection('tasks').where('status', '==', 'open').get();
export const getTask = (taskId) => db.collection('tasks').doc(taskId).get();
export const updateTask = (taskId, data) => db.collection('tasks').doc(taskId).update(data);

export const getLeaderboard = async () => {
  try {
    const result = await client.query('SELECT * FROM users ORDER BY points DESC LIMIT 20');
    return result.rows;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const addBid = async (taskId, bid) => {
  try {
    const bidRef = collection(db, 'tasks', taskId, 'bids');
    const docRef = await addDoc(bidRef, {
      ...bid,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...bid };
  } catch (error) {
    console.error('Error adding bid:', error);
    throw error;
  }
};

export const completeTask = async (taskId, providerId, rating) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const providerRef = doc(db, 'users', providerId);
    
    const taskDoc = await getDoc(taskRef);
    const providerDoc = await getDoc(providerRef);
    
    const currentPoints = providerDoc.data()?.points || 0;
    const taskDetails = taskDoc.data()?.details;

    await updateDoc(providerRef, {
      points: currentPoints + rating,
      tasksCompleted: arrayUnion(taskDetails),
      updatedAt: serverTimestamp()
    });

    await updateDoc(taskRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      rating
    });

    return true;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
};

export const sendNotification = (userId, message) => db.collection('notifications').add({ userId, message, timestamp: new Date().toISOString() });

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Get live ads
export const getLiveAds = async () => {
  try {
    const adsRef = collection(db, 'tasks');
    const q = query(adsRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching live ads:', error);
    return [];
  }
};

// Search profiles
export const searchProfiles = async (searchQuery) => {
  try {
    const profilesRef = collection(db, 'profiles');
    const q = query(
      profilesRef, 
      where('occupation', '>=', searchQuery),
      where('occupation', '<=', searchQuery + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching profiles:', error);
    return [];
  }
};