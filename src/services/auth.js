import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from '@firebase/auth';
import { auth } from '../firebase';
import client from '../database/postgres';
import { Platform } from 'react-native';
import { firebase, db } from '../firebase';

// Regular email/password auth
export const signUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    // Create user profile in PostgreSQL
    await client.query(
      'INSERT INTO users (id, name, email, status) VALUES ($1, $2, $3, $4)',
      [userCredential.user.uid, name, email, 'pending']
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};


export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Social auth providers
const googleProvider = new GoogleAuthProvider();

// Helper function to handle social auth
const handleSocialAuth = async (provider, providerName) => {
  try {
    let userCredential;
    
    if (Platform.OS === 'web') {
      // On web, use popup
      userCredential = await signInWithPopup(auth, provider);
    } else {
      // On mobile, use redirect (requires extra handling)
      await signInWithRedirect(auth, provider);
      userCredential = await getRedirectResult(auth);
    }
    
    // Check if this is a new user
    const isNewUser = userCredential._tokenResponse?.isNewUser;
    
    if (isNewUser) {
      // Create profile for new social auth users
      const { user } = userCredential;
      const userData = {
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || null,
        points: 0,
        completed: 0,
        rating: 0,
        provider: providerName,
        createdAt: new Date().toISOString()
      };
      
      await client.query(
        'INSERT INTO users (id, name, email, status) VALUES ($1, $2, $3, $4)',
        [user.uid, userData.name, userData.email, 'pending']
      );
    } else {
      // Update existing user profile with latest provider data
      const { user } = userCredential;
      const existingProfile = await client.query('SELECT * FROM users WHERE id = $1', [user.uid]);
      
      if (existingProfile.rows.length > 0) {
        // Only update certain fields from the social provider
        await client.query(
          'UPDATE users SET name = $1, email = $2, photoURL = $3, lastLogin = $4 WHERE id = $5',
          [user.displayName || existingProfile.rows[0].name, user.email || existingProfile.rows[0].email, user.photoURL || existingProfile.rows[0].photoURL, new Date().toISOString(), user.uid]
        );
      }
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = () => handleSocialAuth(googleProvider, 'google');

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (email) => auth.sendPasswordResetEmail(email);
export const onAuthStateChanged = (callback) => auth.onAuthStateChanged(callback);