import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const authService = {
  async loginUser(email: string, password: string): Promise<any> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
      return { success: true, user: userSnap.data() };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async googleLogin(): Promise<any> {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', cred.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          user_id: cred.user.uid,
          name: cred.user.displayName || '',
          email: cred.user.email || '',
          role: 'customer',
          createdAt: serverTimestamp()
        });
      }
      return { success: true, user: (await getDoc(userRef)).data() };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async registerUser(name: string, email: string, phone: string, password: string): Promise<any> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      
      const userRef = doc(db, 'users', cred.user.uid);
      const userData = {
        user_id: cred.user.uid,
        name,
        email,
        phone,
        role: 'customer',
        createdAt: serverTimestamp()
      };
      
      await setDoc(userRef, userData);
      return { success: true, user: userData };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};

