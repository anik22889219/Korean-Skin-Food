import { get, post } from './client';

export const authService = {
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
};
