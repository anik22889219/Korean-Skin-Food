import { Product } from '../../types';
import { get, post } from './client';

export const transformProduct = (p: any): Product => {
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

    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]{10,})|[?&]id=([a-zA-Z0-9_-]{10,})/);
      const fileId = match?.[1] || match?.[2];
      if (fileId) {
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

export const productService = {
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
};
