import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Order } from '../../types';

export const useAllOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      const orders = await api.getAllOrders();
      if (!orders) throw new Error('Failed to fetch orders');
      return orders;
    },
  });
};

export const useUserOrders = (phone: string | undefined) => {
  return useQuery<Order[], Error>({
    queryKey: ['orders', 'user', phone],
    queryFn: async () => {
      if (!phone) return [];
      const orders = await api.getUserOrders(phone);
      if (!orders) throw new Error('Failed to fetch user orders');
      return orders;
    },
    enabled: !!phone,
  });
};
