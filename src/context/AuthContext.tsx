import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  limit 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';
import type { User } from '../types';
import {
  isAdminTeam,
  isSuperAdmin as checkSuperAdmin,
  isAdmin as checkAdmin,
  isCustomer,
  isViewer,
  isInventoryManager,
  isCustomerSupport,
  canAccessInventory,
  canAccessCustomerSupport,
  canAccessSettings,
} from '../lib/roles';

// ─────────────────────────────────────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;

  // Sign-in methods
  loginWithEmail: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;

  // Role flags
  isAdminTeam: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isViewer: boolean;
  isInventoryManager: boolean;
  isCustomerSupport: boolean;

  // Feature access
  canAccessInventory: boolean;
  canAccessCustomerSupport: boolean;
  canAccessSettings: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches (or seeds) a user document from Firestore.
 * Returns a typed `User` with role populated.
 */
async function fetchOrCreateUserDoc(
  fbUser: FirebaseUser,
  overrides?: Partial<User>
): Promise<User> {
  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    return {
      user_id: fbUser.uid,
      name: data.name || fbUser.displayName || '',
      email: data.email || fbUser.email || '',
      phone: data.phone || '',
      address: data.address || '',
      role: (String(data.role || 'customer').trim().toLowerCase()) as User['role'],
    };
  }

  // UID doc not found → Check for migrated record by email or phone
  let migratedData: any = null;
  
  if (fbUser.email) {
    const q = query(collection(db, 'users'), where('email', '==', fbUser.email), limit(1));
    const qs = await getDocs(q);
    if (!qs.empty) migratedData = qs.docs[0].data();
  }

  // If still not found and phone is available (rare for first Google login)
  if (!migratedData && fbUser.phoneNumber) {
    const q = query(collection(db, 'users'), where('phone', '==', fbUser.phoneNumber.replace('+88', '')), limit(1));
    const qs = await getDocs(q);
    if (!qs.empty) migratedData = qs.docs[0].data();
  }

  const newUser: User = {
    user_id: fbUser.uid,
    name: overrides?.name || migratedData?.name || fbUser.displayName || '',
    email: overrides?.email || migratedData?.email || fbUser.email || '',
    phone: overrides?.phone || migratedData?.phone || '',
    address: overrides?.address || migratedData?.address || '',
    role: (overrides?.role || migratedData?.role || 'customer') as User['role'],
  };

  await setDoc(ref, {
    ...newUser,
    createdAt: migratedData?.createdAt || serverTimestamp(),
    migratedFrom: migratedData ? 'legacy_sheet' : 'none'
  });

  return newUser;
}


// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until Firebase resolves

  // ── Firebase Auth State Listener ──────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const appUser = await fetchOrCreateUserDoc(fbUser);
          setFirebaseUser(fbUser);
          setUser(appUser);
        } catch (err) {
          console.error('[Auth] Failed to fetch user doc:', err);
          setUser(null);
          setFirebaseUser(null);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  // ── Email / Password Login ────────────────────────────────────────────────
  const loginWithEmail = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const appUser = await fetchOrCreateUserDoc(cred.user);
        setFirebaseUser(cred.user);
        setUser(appUser);
        return appUser;
      } catch (err: any) {
        console.error('[Auth] Email login error:', err.code, err.message);
        throw err; // let the UI handle the specific error code
      }
    },
    []
  );

  // ── Google Sign-In ────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (): Promise<User | null> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const appUser = await fetchOrCreateUserDoc(cred.user);
      setFirebaseUser(cred.user);
      setUser(appUser);
      return appUser;
    } catch (err: any) {
      console.error('[Auth] Google login error:', err.code, err.message);
      throw err;
    }
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(
    async (name: string, email: string, password: string): Promise<User | null> => {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        const appUser = await fetchOrCreateUserDoc(cred.user, { name, role: 'customer' });
        setFirebaseUser(cred.user);
        setUser(appUser);
        return appUser;
      } catch (err: any) {
        console.error('[Auth] Register error:', err.code, err.message);
        throw err;
      }
    },
    []
  );

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('[Auth] Sign-out error:', e);
    } finally {
      // Always clear local state — even if Firebase signOut fails,
      // we want the UI to reflect a logged-out state.
      setUser(null);
      setFirebaseUser(null);
    }
  }, []);

  // ── Role flags ────────────────────────────────────────────────────────────
  const isAdminTeamFlag        = isAdminTeam(user);
  const isSuperAdminFlag       = checkSuperAdmin(user);
  const isAdminFlag            = checkAdmin(user);
  const isCustomerFlag         = isCustomer(user);
  const isViewerFlag           = isViewer(user);
  const isInventoryManagerFlag = isInventoryManager(user);
  const isCustomerSupportFlag  = isCustomerSupport(user);

  const canAccessInventoryFlag        = canAccessInventory(user);
  const canAccessCustomerSupportFlag  = canAccessCustomerSupport(user);
  const canAccessSettingsFlag         = canAccessSettings(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        register,
        logout,
        isAdminTeam: isAdminTeamFlag,
        isSuperAdmin: isSuperAdminFlag,
        isAdmin: isAdminFlag,
        isCustomer: isCustomerFlag,
        isViewer: isViewerFlag,
        isInventoryManager: isInventoryManagerFlag,
        isCustomerSupport: isCustomerSupportFlag,
        canAccessInventory: canAccessInventoryFlag,
        canAccessCustomerSupport: canAccessCustomerSupportFlag,
        canAccessSettings: canAccessSettingsFlag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
