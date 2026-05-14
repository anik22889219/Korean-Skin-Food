import axios from 'axios';
import { Product, SiteSettings, Order } from '../types';

// ── API Base URL ──────────────────────────────────────────────────────────────
// All requests go directly to Google Apps Script Web App.
// On Netlify (static hosting), there is no Express server.
const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

if (!SCRIPT_URL) {
  console.error('[KSF API] VITE_APPS_SCRIPT_URL is not set. Check your .env file.');
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const get = (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  return axios.get(`${SCRIPT_URL}?${query}`);
};

const post = (body: Record<string, unknown>) => {
  // Google Apps Script requires text/plain to bypass CORS preflight issues on POST requests
  return axios.post(SCRIPT_URL, JSON.stringify(body), {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  });
};

const transformProduct = (p: any): Product => {
  if (!p || p.error) return null as any;

  const getVal = (...keys: string[]) => {
    const normalize = (s: string) => String(s).toLowerCase().replace(/[\s_-]/g, '');
    for (const key of keys) {
      const normalizedKey = normalize(key);
      const foundKey = Object.keys(p).find(k => normalize(k) === normalizedKey);
      if (foundKey) return p[foundKey];
    }
    return undefined;
  };

  const rawImages = getVal('images', 'image', 'img', 'product_images');
  let images: string[] = [];

  const processImage = (img: any) => {
    let url = String(img).trim();
    if (!url || url === 'undefined' || url === 'null') return '';

    // Handle all Google Drive URL formats:
    // /file/d/FILE_ID/view
    // /open?id=FILE_ID
    // /uc?id=FILE_ID
    // /thumbnail?id=FILE_ID
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      // Extract file ID — appears after /d/, after id=, or after /folders/
      const match = url.match(/\/d\/([a-zA-Z0-9_-]{10,})|[?&]id=([a-zA-Z0-9_-]{10,})/);
      const fileId = match?.[1] || match?.[2];
      if (fileId) {
        // Use thumbnail API for best compatibility with shared Drive files
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
      }
    }
    return url;
  };

  if (typeof rawImages === 'string' && rawImages.trim()) {
    images = rawImages.split(',').map(processImage).filter(Boolean);
  } else if (Array.isArray(rawImages)) {
    images = rawImages.map(processImage).filter(Boolean);
  }

  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop'];
  }

  return {
    product_id: String(getVal('product_id', 'id') || '').trim(),
    name_en: String(getVal('name_en', 'name') || ''),
    name_bn: String(getVal('name_bn', 'bangla_name') || ''),
    category: String(getVal('category') || 'Uncategorized'),
    price: Number(getVal('price') || 0) || 0,
    discount_price: getVal('discount_price', 'sale_price')
      ? Number(getVal('discount_price', 'sale_price')) || undefined
      : undefined,
    stock: Number(getVal('stock', 'quantity') || 0) || 0,
    description_en: String(getVal('description_en', 'description') || ''),
    description_bn: String(getVal('description_bn', 'bangla_description') || ''),
    images,
    ingredients: String(getVal('ingredients') || ''),
    skin_type: String(getVal('skin_type', 'skin') || 'All'),
    tags: String(getVal('tags') || ''),
    barcode: String(getVal('barcode', 'upc', 'ean') || ''),
    is_featured:
      getVal('is_featured', 'featured') === true ||
      getVal('is_featured', 'featured') === 'TRUE' ||
      getVal('is_featured', 'featured') === 1,
  };
};

const mapOrder = (o: any): Order => ({
  order_id: String(o.order_id || ''),
  timestamp: String(o.order_date || o.timestamp || ''),
  customer_name: String(o.name || o.customer_name || ''),
  customer_phone: String(o.customer_phone || ''),
  customer_address: String(o.customer_address || ''),
  items:
    typeof o.items === 'string'
      ? JSON.parse(o.items)
      : Array.isArray(o.items)
      ? o.items
      : [],
  total: Number(o.total_amount || o.total || 0),
  payment_method: String(o.payment_method || 'Cash on Delivery'),
  status: (o.delivery_status || o.status || 'Pending') as any,
  admin_note: String(o.admin_note || ''),
});

// ── API Object ────────────────────────────────────────────────────────────────
export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await get({ action: 'getProducts' });
      return Array.isArray(res.data)
        ? res.data.map(transformProduct).filter(Boolean)
        : [];
    } catch (err) {
      console.error('[KSF] getProducts error:', err);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await get({ action: 'getProductById', id: id.trim() });
      const product = transformProduct(res.data);
      return product && product.product_id ? product : null;
    } catch (err) {
      console.error('[KSF] getProductById error:', err);
      return null;
    }
  },

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const res = await get({ action: 'getProductByBarcode', barcode: barcode.trim() });
      const product = transformProduct(res.data);
      return product && product.product_id ? product : null;
    } catch (err) {
      console.error('[KSF] getProductByBarcode error:', err);
      return null;
    }
  },

  async addProduct(product: Partial<Product>): Promise<any> {
    return post({ action: 'addProduct', ...product });
  },

  async updateProduct(product: Partial<Product>): Promise<any> {
    return post({ action: 'updateProduct', ...product });
  },

  async deleteProduct(productId: string): Promise<any> {
    return post({ action: 'deleteProduct', product_id: productId });
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const res = await get({ action: 'getSettings' });
      const settings: any = {};
      if (Array.isArray(res.data)) {
        res.data.forEach((item: any) => { settings[item.key] = item.value; });
      }
      return settings as SiteSettings;
    } catch {
      return {} as SiteSettings;
    }
  },

  // Orders
  async placeOrder(orderData: any): Promise<{ success: boolean; order_id: string; error?: string }> {
    const res = await post({
      action: 'placeOrder',
      ...orderData,
      total_amount: orderData.total,
    });
    return res.data;
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const res = await get({ action: 'getAllOrders' });
      return Array.isArray(res.data) ? res.data.map(mapOrder) : [];
    } catch (err) {
      console.error('[KSF] getAllOrders error:', err);
      return [];
    }
  },

  async getUserOrders(phone: string): Promise<Order[]> {
    try {
      const res = await get({ action: 'getUserOrders', phone });
      return Array.isArray(res.data) ? res.data.map(mapOrder) : [];
    } catch (err) {
      console.error('[KSF] getUserOrders error:', err);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return post({ action: 'updateOrderStatus', order_id: orderId, status });
  },

  // Stock / Inventory
  async updateStock(productId: string, newStock: number): Promise<any> {
    return post({ action: 'updateStock', product_id: productId, stock: newStock });
  },

  async packOrder(orderId: string, productId: string, userRole: string): Promise<any> {
    return post({ action: 'packOrder', order_id: orderId, product_id: productId, user_role: userRole });
  },

  async getInventoryLogs(): Promise<any[]> {
    try {
      const res = await get({ action: 'getInventoryLogs' });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // Customers & Leads
  async saveLead(leadData: { name: string; phone: string; address?: string; source: string; skin_type?: string; concern?: string }): Promise<any> {
    return post({ action: 'saveLead', ...leadData });
  },

  async getCustomerByPhone(phone: string): Promise<any> {
    try {
      const res = await get({ action: 'getCustomerByPhone', phone });
      return res.data;
    } catch {
      return null;
    }
  },

  async getAllCustomers(): Promise<any[]> {
    try {
      const res = await get({ action: 'getAllCustomers' });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    try {
      const res = await get({ action: 'getAnalytics' });
      return res.data;
    } catch {
      return null;
    }
  },

  // Auth
  async loginUser(phone: string, password: string): Promise<any> {
    const res = await post({ action: 'loginUser', phone, password });
    return res.data;
  },

  async googleLogin(email: string, name: string, picture?: string): Promise<any> {
    const res = await post({ action: 'googleLogin', email, name, picture });
    return res.data;
  },

  async registerUser(name: string, email: string, phone: string, password: string): Promise<any> {
    const res = await post({ action: 'registerUser', name, email, phone, password });
    return res.data;
  },

  // Sheet Management (super_admin only)
  async manageSheet(config: {
    sub_action: 'createSheet' | 'addColumn';
    sheet_name: string;
    headers?: string[];
    column_name?: string;
    user_role: string;
  }): Promise<any> {
    return post({ action: 'manageSheet', ...config });
  },

  // Dropshipping & Sourcing
  async getSourcedProducts(): Promise<any[]> {
    // Simulated sourcing marketplace for Korean Skin Care
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
    const productData: Partial<Product> = {
      product_id: sourcedProduct.id.replace('S-', 'KSF-'),
      name_en: sourcedProduct.name,
      category: sourcedProduct.category,
      price: sourcedProduct.suggested_retail,
      stock: 10, // Initial dropshipping stock
      images: [sourcedProduct.image],
      description_en: `Authentic ${sourcedProduct.name} by ${sourcedProduct.brand}. Sourced directly from Korean suppliers.`,
      tags: `dropshipping, ${sourcedProduct.brand}, ${sourcedProduct.category}`,
    };
    return this.addProduct(productData);
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
    return post({ action: 'logAction', ...details });
  },

  // System Initialization & Repair
  async initializeSystem(): Promise<any> {
    // This will check and add missing columns across all critical sheets
    const criticalFixes = [
      { sheet: 'Product list 2026', col: 'barcode' },
      { sheet: 'Orders', col: 'admin_note' },
      { sheet: 'Users', col: 'role' },
      { sheet: 'inventory_logs', col: 'user_role' }
    ];

    for (const fix of criticalFixes) {
      await this.manageSheet({
        sub_action: 'addColumn',
        sheet_name: fix.sheet,
        column_name: fix.col,
        user_role: 'super_admin'
      });
    }
    return { success: true };
  },
};
