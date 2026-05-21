import { Order } from '../../types';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export const mapOrder = (o: any): Order => ({
  order_id: String(o.order_id || ''),
  timestamp: o.timestamp?.toDate ? o.timestamp.toDate().toISOString() : String(o.timestamp || ''),
  customer_name: String(o.customer_name || o.name || ''),
  customer_phone: String(o.customer_phone || ''),
  customer_address: String(o.customer_address || ''),
  items: Array.isArray(o.items) ? o.items : [],
  total: Number(o.total_amount || o.total || 0),
  payment_method: String(o.payment_method || 'Cash on Delivery'),
  status: (o.delivery_status || o.status || 'Pending') as any,
  admin_note: String(o.admin_note || ''),
});

export const orderService = {
  async placeOrder(orderData: any): Promise<{ success: boolean; order_id: string; error?: string }> {
    try {
      const orderId = `ORD-${Date.now()}`;
      const docRef = doc(db, 'orders', orderId);
      
      const firestoreOrder = {
        ...orderData,
        order_id: orderId,
        total_amount: orderData.total,
        delivery_status: 'Pending',
        timestamp: serverTimestamp(),
      };
      
      await setDoc(docRef, firestoreOrder);
      return { success: true, order_id: orderId };
    } catch (err: any) {
      console.error('[KSF] placeOrder error:', err);
      return { success: false, order_id: '', error: err.message };
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => mapOrder(doc.data()));
    } catch (err) {
      console.error('[KSF] getAllOrders error:', err);
      return [];
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'), 
        where('userId', '==', userId), 
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => mapOrder(doc.data()));
    } catch (err) {
      console.error('[KSF] getUserOrders error:', err);
      // Fallback to phone search if userId is not available (legacy)
      try {
        const q2 = query(
          collection(db, 'orders'), 
          where('customer_phone', '==', userId), 
          orderBy('timestamp', 'desc')
        );
        const snapshot2 = await getDocs(q2);
        return snapshot2.docs.map(doc => mapOrder(doc.data()));
      } catch (err2) {
        return [];
      }
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, { delivery_status: status });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Task 3.6 — BD SMS Integration
  async sendOrderConfirmationSMS(phone: string, orderId: string, amount: number): Promise<boolean> {
    try {
      // Mock integration for BulkSMSBD or Greenweb
      console.log(`[SMS Gateway] Sending SMS to ${phone}...`);
      console.log(`[SMS Content]: আপনার অর্ডার #${orderId} সফলভাবে গ্রহণ করা হয়েছে। মোট বিল: ৳${amount.toLocaleString()}। ধন্যবাদ - Korean Skin Food`);
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    } catch (err) {
      console.error('[SMS Gateway] Failed to send SMS:', err);
      return false;
    }
  },
};

