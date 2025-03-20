import { db } from '../firebase';
import { 
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  writeBatch,
  arrayUnion
} from 'firebase/firestore';

class TaskService {
  static async createTask(userId, taskData) {
    try {
      const task = {
        ...taskData,
        userId,
        status: 'open',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'tasks'), task);
      return { id: docRef.id, ...task };
    } catch (error) {
      throw error;
    }
  }

  static async getTasks(filters = {}) {
    try {
      let tasksQuery = query(
        collection(db, 'tasks'),
        orderBy('createdAt', 'desc')
      );

      if (filters.status) {
        tasksQuery = query(tasksQuery, where('status', '==', filters.status));
      }

      if (filters.userId) {
        tasksQuery = query(tasksQuery, where('userId', '==', filters.userId));
      }

      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  static async updateTaskStatus(taskId, status, providerId = null) {
    try {
      const batch = writeBatch(db);
      const taskRef = doc(db, 'tasks', taskId);

      batch.update(taskRef, {
        status,
        providerId,
        updatedAt: serverTimestamp()
      });

      if (providerId) {
        const providerRef = doc(db, 'users', providerId);
        batch.update(providerRef, {
          activeTasks: arrayUnion(taskId)
        });
      }

      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getTaskDetails(taskId) {
    try {
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      if (!taskDoc.exists()) {
        throw new Error('Task not found');
      }

      const bidsQuery = query(
        collection(db, 'tasks', taskId, 'bids'),
        orderBy('createdAt', 'desc')
      );
      const bidsSnapshot = await getDocs(bidsQuery);

      return {
        id: taskDoc.id,
        ...taskDoc.data(),
        bids: bidsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      };
    } catch (error) {
      throw error;
    }
  }
}

export default TaskService;

// Create a new project
export const createProject = async (projectData) => {
  try {
    const projectRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      status: 'open',
      createdAt: new Date().toISOString()
    });
    return projectRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Get projects for a specific user
export const getUserProjects = async (userId) => {
  try {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get all open projects
export const getOpenProjects = async () => {
  try {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'open')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching open projects:', error);
    throw error;
  }
}; 