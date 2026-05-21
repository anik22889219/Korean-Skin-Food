import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

export const customerService = {
  async saveLead(leadData: any): Promise<any> {
    try {
      await addDoc(collection(db, 'customer_leads'), {
        ...leadData,
        timestamp: serverTimestamp()
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getCustomerByPhone(phone: string): Promise<any> {
    try {
      const q = query(collection(db, 'users'), where('phone', '==', phone), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        const oQ = query(collection(db, 'orders'), where('userId', '==', user.user_id));
        const orderSnapshot = await getDocs(oQ);
        const orders = orderSnapshot.docs.map(doc => doc.data());
        return { user, orders };
      }
      return { user: null, orders: [] };
    } catch (err: any) {
      console.error('[KSF] getCustomerByPhone error:', err);
      return { error: err.message };
    }
  },

  async getAllCustomers(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => doc.data());
    } catch {
      return [];
    }
  },

  async getAllLeads(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'customer_leads'));
      return querySnapshot.docs.map(doc => doc.data());
    } catch {
      return [];
    }
  },
};

