import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Product } from '../../types';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const products = await api.getProducts();
      // Temporary check if the API still returns empty array on error instead of throwing
      if (!products) throw new Error('Failed to fetch products');
      return products;
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery<Product | null, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const product = await api.getProductById(id);
      return product;
    },
    enabled: !!id,
  });
};

export const useProductByBarcode = (barcode: string | undefined) => {
  return useQuery<Product | null, Error>({
    queryKey: ['product', 'barcode', barcode],
    queryFn: async () => {
      if (!barcode) return null;
      const product = await api.getProductByBarcode(barcode);
      return product;
    },
    enabled: !!barcode,
  });
};
