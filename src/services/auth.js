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
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, collection, query, where } from 'firebase/firestore';
import { Platform } from 'react-native';

// Regular email/password auth
export const signUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return { user, profile: userDoc.data() };
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
      
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        status: 'pending'
      });
    } else {
      // Update existing user profile with latest provider data
      const { user } = userCredential;
      const existingProfile = await getDoc(doc(db, 'users', user.uid));
      
      if (existingProfile.exists()) {
        // Only update certain fields from the social provider
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || existingProfile.data().name,
          email: user.email || existingProfile.data().email,
          photoURL: user.photoURL || existingProfile.data().photoURL,
          lastLogin: new Date().toISOString()
        });
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