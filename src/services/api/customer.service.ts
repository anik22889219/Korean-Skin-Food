import { get, post } from './client';

export const customerService = {
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
};
