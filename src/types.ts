export interface Product {
  product_id: string;
  name_en: string;
  name_bn: string;
  category: string;
  price: number;
  discount_price?: number;
  stock: number;
  description_en: string;
  description_bn: string;
  images: string[]; // Will handle comma-delimited string transformation in API
  ingredients: string;
  skin_type: string;
  tags: string;
  is_featured: boolean;
  barcode?: string;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'super_admin' | 'inventory_manager' | 'customer_support' | 'moderator' | 'viewer';
}

export interface CustomerLead {
  lead_id: string;
  name: string;
  phone: string;
  address: string;
  source: 'AI_CHATBOT' | 'META_ADS' | 'DIRECT';
  timestamp: string;
}

export interface InventoryLog {
  log_id: string;
  product_id: string;
  change_type: 'STOCK_UPDATE' | 'SCAN_PACK' | 'ORDER_PLACE';
  quantity: number;
  timestamp: string;
  user_role: string;
}

export interface SystemLog {
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface AnalyticsData {
  total_orders: number;
  total_leads: number;
  total_products: number;
  revenue: number;
}

export interface Order {
  order_id: string;
  timestamp: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: CartItem[];
  total: number;
  payment_method: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  admin_note: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SiteSettings {
  popup_enabled: boolean;
  popup_title: string;
  popup_discount: string;
  whatsapp_number: string;
  banner_text: string;
  announcement_bar: string;
  delivery_inside_dhaka: number;
  delivery_outside_dhaka: number;
}
