import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Send notification to a specific user
export const sendNotification = async (userId, message) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      read: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Get notifications for a specific user
export const getUserNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}; 