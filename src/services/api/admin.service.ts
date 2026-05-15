import { SiteSettings } from '../../types';
import { get, post } from './client';
import { productService } from './product.service';

export const adminService = {
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

  // Analytics
  async getAnalytics(): Promise<any> {
    try {
      const res = await get({ action: 'getAnalytics' });
      return res.data;
    } catch {
      return null;
    }
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
    const productData: any = {
      product_id: sourcedProduct.id.replace('S-', 'KSF-'),
      name_en: sourcedProduct.name,
      category: sourcedProduct.category,
      price: sourcedProduct.suggested_retail,
      stock: 10, // Initial dropshipping stock
      images: [sourcedProduct.image],
      description_en: `Authentic ${sourcedProduct.name} by ${sourcedProduct.brand}. Sourced directly from Korean suppliers.`,
      tags: `dropshipping, ${sourcedProduct.brand}, ${sourcedProduct.category}`,
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
