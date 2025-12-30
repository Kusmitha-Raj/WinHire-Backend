import { api } from './api';

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  microsoftLogin: async (accessToken: string) => {
    const response = await api.post('/auth/microsoft-login', { accessToken });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};
