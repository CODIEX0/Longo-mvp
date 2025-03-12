import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

class FirebaseAuthService {
  static async signUp(email, password, name, role = 'client') {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Send verification email
      await sendEmailVerification(firebaseUser);

      // Create user profile in Firestore
      await this.createUserProfile(firebaseUser.uid, email, name, role);

      return firebaseUser;
    } catch (error) {
      throw error;
    }
  }

  static async createUserProfile(userId, email, name, role) {
    await setDoc(doc(db, 'users', userId), {
      email,
      name,
      role,
      status: role === 'service_provider' ? 'pending' : 'active',
      email_verified: false,
      createdAt: new Date().toISOString()
    });
  }

  static async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPasswordReset(code) {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      return email;
    } catch (error) {
      throw error;
    }
  }

  static async confirmPasswordReset(code, newPassword) {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firestore user verification status
      if (user.emailVerified) {
        await setDoc(doc(db, 'users', user.uid), { email_verified: true });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default FirebaseAuthService; 