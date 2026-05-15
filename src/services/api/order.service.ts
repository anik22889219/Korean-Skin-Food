import { Order } from '../../types';
import { get, post } from './client';

export const mapOrder = (o: any): Order => ({
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

export const orderService = {
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
};
