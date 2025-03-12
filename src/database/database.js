import client from '../database/postgres';

// User Profile Operations
export const getUserProfile = async (userId) => {
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const createProfile = async (userId, userData) => {
  try {
    await client.query(
      'INSERT INTO users (id, name, email, status) VALUES ($1, $2, $3, $4)',
      [userId, userData.name, userData.email, 'pending']
    );
    return userData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = Object.values(updates);
    await client.query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length + 1}`,
      [...values, userId]
    );
    return updates;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Live Ads Operations
export const getLiveAds = async () => {
  try {
    const adsRef = ref(db, 'tasks');
    const adsQuery = query(adsRef, 
      orderByChild('status'),
      equalTo('active')
    );
    const snapshot = await get(adsQuery);
    if (snapshot.exists()) {
      const ads = [];
      snapshot.forEach((child) => {
        ads.push({
          id: child.key,
          ...child.val()
        });
      });
      return ads;
    }
    return [];
  } catch (error) {
    console.error('Error fetching live ads:', error);
    return [];
  }
};

export const createTask = (data) => {
  const tasksRef = ref(db, 'tasks');
  return push(tasksRef, {
    ...data,
    createdAt: new Date().toISOString()
  });
};

// Leaderboard Operations
export const getLeaderboard = async () => {
  try {
    const profilesRef = ref(db, 'profiles');
    const leaderQuery = query(
      profilesRef,
      orderByChild('points'),
      limitToLast(20)
    );
    const snapshot = await get(leaderQuery);
    if (snapshot.exists()) {
      const leaders = [];
      snapshot.forEach((child) => {
        leaders.push({
          id: child.key,
          ...child.val()
        });
      });
      return leaders.reverse(); // Reverse to get descending order
    }
    return [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Search Operations
export const searchProfiles = async (searchQuery) => {
  try {
    const profilesRef = ref(db, 'profiles');
    const searchQueryLower = searchQuery.toLowerCase();
    const snapshot = await get(profilesRef);
    if (snapshot.exists()) {
      const profiles = [];
      snapshot.forEach((child) => {
        const profile = child.val();
        if (profile.occupation && 
            profile.occupation.toLowerCase().includes(searchQueryLower)) {
          profiles.push({
            id: child.key,
            ...profile
          });
        }
      });
      return profiles;
    }
    return [];
  } catch (error) {
    console.error('Error searching profiles:', error);
    return [];
  }
};

// Task Operations
export const getTask = async (taskId) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  const snapshot = await get(taskRef);
  if (snapshot.exists()) {
    return {
      id: snapshot.key,
      ...snapshot.val()
    };
  }
  return null;
};

export const updateTask = (taskId, data) => {
  return set(ref(db, `tasks/${taskId}`), data);
};

export const addBid = (taskId, bid) => {
  const bidRef = ref(db, `tasks/${taskId}/bids`);
  return push(bidRef, bid);
};

export const completeTask = async (taskId, providerId, rating) => {
  const task = await getTask(taskId);
  const provider = await getUserProfile(providerId);
  const points = (provider.points || 0) + rating;
  const tasksCompleted = [...(provider.tasksCompleted || []), task.details];
  
  await updateUserProfile(providerId, { 
    ...provider,
    points,
    tasksCompleted
  });
  
  await updateTask(taskId, { 
    ...task,
    status: 'completed'
  });
};

// Notifications
export const sendNotification = (userId, message) => {
  const notificationsRef = ref(db, 'notifications');
  return push(notificationsRef, {
    userId,
    message,
    timestamp: new Date().toISOString()
  });
}; 