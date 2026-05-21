import { Product } from '../../types';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  limit
} from 'firebase/firestore';

export const transformProduct = (p: any): Product => {
  if (!p) return null as any;

  // Use a simpler mapping if data is already normalized in Firestore
  // but keep the robust mapper to handle potential inconsistencies from legacy sheets data
  const getVal = (...keys: string[]) => {
    for (const key of keys) {
      if (p[key] !== undefined) return p[key];
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
    import_price: Number(getVal('import_price', 'cost_price') || 0) || undefined,
    is_featured:
      getVal('is_featured', 'featured') === true ||
      getVal('is_featured', 'featured') === 'TRUE' ||
      getVal('is_featured', 'featured') === 1,
  };
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => transformProduct(doc.data())).filter(Boolean);
    } catch (err) {
      console.error('[KSF] getProducts error:', err);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', id.trim());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return transformProduct(docSnap.data());
      }
      return null;
    } catch (err) {
      console.error('[KSF] getProductById error:', err);
      return null;
    }
  },

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const q = query(collection(db, 'products'), where('barcode', '==', barcode.trim()), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return transformProduct(querySnapshot.docs[0].data());
      }
      return null;
    } catch (err) {
      console.error('[KSF] getProductByBarcode error:', err);
      return null;
    }
  },

  async addProduct(product: Partial<Product>): Promise<any> {
    if (!product.product_id) throw new Error('Product ID is required');
    const docRef = doc(db, 'products', product.product_id);
    await setDoc(docRef, product);
    return { success: true };
  },

  async updateProduct(product: Partial<Product>): Promise<any> {
    if (!product.product_id) throw new Error('Product ID is required');
    const docRef = doc(db, 'products', product.product_id);
    await updateDoc(docRef, product as any);
    return { success: true };
  },

  async deleteProduct(productId: string): Promise<any> {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return { success: true };
  },
};

