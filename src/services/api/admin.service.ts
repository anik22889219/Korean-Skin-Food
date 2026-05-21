import { SiteSettings } from '../../types';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { productService } from './product.service';
import { uploadUrlToCloudinary } from '../cloudinary';

export const adminService = {
  // Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const querySnapshot = await getDocs(collection(db, 'settings'));
      const settings: any = {};
      querySnapshot.forEach((doc) => {
        settings[doc.id] = doc.data().value;
      });
      return settings as SiteSettings;
    } catch {
      return {} as SiteSettings;
    }
  },

  // Stock / Inventory
  async updateStock(productId: string, newStock: number): Promise<any> {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, { stock: newStock });
      
      // Log inventory change
      await addDoc(collection(db, 'inventory_logs'), {
        product_id: productId,
        change_type: 'STOCK_UPDATE',
        quantity: newStock,
        timestamp: serverTimestamp(),
        user_role: 'admin'
      });
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async packOrder(orderId: string, productId: string, userRole: string): Promise<any> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { delivery_status: 'ready_for_delivery' });
      
      // Log scan event
      await addDoc(collection(db, 'inventory_logs'), {
        product_id: productId,
        change_type: 'SCAN_PACK',
        order_id: orderId,
        timestamp: serverTimestamp(),
        user_role: userRole
      });
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getInventoryLogs(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'inventory_logs'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch {
      return [];
    }
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    try {
      const orders = await getDocs(collection(db, 'orders'));
      const leads = await getDocs(collection(db, 'customer_leads'));
      const products = await getDocs(collection(db, 'products'));
      
      let revenue = 0;
      orders.forEach(doc => {
        const data = doc.data();
        revenue += Number(data.total_amount || data.total || 0);
      });

      return {
        total_orders: orders.size,
        total_leads: leads.size,
        total_products: products.size,
        revenue: revenue
      };
    } catch {
      return null;
    }
  },

  // Sheet Management - Deprecated for Firestore, kept for compatibility as no-op
  async manageSheet(config: any): Promise<any> {
    console.warn('manageSheet is deprecated for Firestore.');
    return { success: true, message: 'Firestore does not require sheet management.' };
  },

  // Dropshipping & Sourcing
  async getSourcedProducts(): Promise<any[]> {
    const mockSourced = [
      {
        id: 'S-COSRX-01',
        name: 'COSRX Low pH Good Morning Gel Cleanser',
        category: 'Cleanser',
        supplier_price: 850,
        suggested_retail: 1250,
        stock: 500,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
        brand: 'COSRX',
        rating: 4.8
      },
      {
        id: 'S-BEAUTY-02',
        name: 'Beauty of Joseon Relief Sun : Rice + Probiotics',
        category: 'Sunscreen',
        supplier_price: 1100,
        suggested_retail: 1650,
        stock: 250,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
        brand: 'Beauty of Joseon',
        rating: 4.9
      },
      {
        id: 'S-ANUA-03',
        name: 'Anua Heartleaf 77% Soothing Toner',
        category: 'Toner',
        supplier_price: 1400,
        suggested_retail: 2100,
        stock: 120,
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop',
        brand: 'Anua',
        rating: 4.7
      },
      {
        id: 'S-INNIS-04',
        name: 'Innisfree Green Tea Seed Serum',
        category: 'Serum',
        supplier_price: 1600,
        suggested_retail: 2400,
        stock: 300,
        image: 'https://images.unsplash.com/photo-1556228448-61928995c65f?q=80&w=600&auto=format&fit=crop',
        brand: 'Innisfree',
        rating: 4.6
      }
    ];
    return mockSourced;
  },

  async importProduct(sourcedProduct: any): Promise<any> {
    // Ensure image is hosted on our Cloudinary
    let imageUrl = sourcedProduct.image;
    try {
      imageUrl = await uploadUrlToCloudinary(sourcedProduct.image);
    } catch (e) {
      console.error('Failed to upload imported image to Cloudinary, using source URL.', e);
    }

    const productData: any = {
      product_id: sourcedProduct.id.replace('S-', 'KSF-'),
      name_en: sourcedProduct.name,
      category: sourcedProduct.category,
      price: sourcedProduct.suggested_retail,
      stock: 10,
      images: [imageUrl],
      description_en: `Authentic ${sourcedProduct.name} by ${sourcedProduct.brand}. Sourced directly from Korean suppliers.`,
      tags: `dropshipping, ${sourcedProduct.brand}, ${sourcedProduct.category}`,
      barcode: '880' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0'), // Generate a dummy K-beauty EAN-13 style barcode
    };
    return productService.addProduct(productData);
  },

  async getDropshippingStats(): Promise<any> {
    return {
      totalSourced: 4,
      totalImported: 0,
      activeRequests: 2,
      potentialProfit: 15400
    };
  },

  // Audit Logging
  async logAction(details: any): Promise<any> {
    try {
      await addDoc(collection(db, 'logs'), {
        ...details,
        timestamp: serverTimestamp()
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // System Initialization & Repair - Deprecated for Firestore
  async initializeSystem(): Promise<any> {
    console.warn('initializeSystem is deprecated for Firestore.');
    return { success: true };
  },
};

