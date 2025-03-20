import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthService {
  static async signUp(email, password, firstName, lastName) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        role: 'service_provider',
        status: 'active',
        points: 0,
        tasksCompleted: [],
        createdAt: new Date().toISOString()
      });

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async signIn(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      return userDoc.data();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async signOut() {
    return signOut(auth);
  }

  static generateToken(user) {
    return jwt.sign({
      id: user.uid,
      email: user.email,
      role: 'service_provider',
      status: 'active'
    }, JWT_SECRET, { expiresIn: '24h' });
  }

  static async resetPassword(email) {
    try {
      const resetToken = Math.random().toString(36).substring(2);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const query = `
        UPDATE users 
        SET reset_token = $1, reset_token_expires = $2 
        WHERE email = $3
        RETURNING id;
      `;

      const result = await db.query(query, [resetToken, expiresAt, email]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  static async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            name: result.user.displayName,
            photoURL: result.user.photoURL,
            role: 'service_provider',
            status: 'active',
            createdAt: new Date().toISOString()
          });
        }
        
        return result.user;
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }
}

export default AuthService; 