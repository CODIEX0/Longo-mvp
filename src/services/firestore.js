import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from '@firebase/firestore';
import { db } from '../firebase';
import client from '../database/postgres';

export const createProfile = async (userId, data) => {
  try {
    await client.query(
      'INSERT INTO users (id, name, email, status) VALUES ($1, $2, $3, $4)',
      [userId, data.name, data.email, 'pending']
    );
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const getProfile = (userId) => db.collection('profiles').doc(userId).get();

export const updateProfile = async (userId, data) => {
  try {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = Object.values(data);
    await client.query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length + 1}`,
      [...values, userId]
    );
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

export const addBid = (taskId, bid) => db.collection('tasks').doc(taskId).collection('bids').add(bid);

export const completeTask = async (taskId, providerId, rating) => {
    const task = await getTask(taskId);
    const provider = await getProfile(providerId);
    const points = provider.data().points + rating;
    await updateProfile(providerId, { points, tasksCompleted: [...(provider.data().tasksCompleted || []), task.data().details] });
    await updateTask(taskId, { status: 'completed' });
  };
  export const sendNotification = (userId, message) => db.collection('notifications').add({ userId, message, timestamp: new Date().toISOString() });

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
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