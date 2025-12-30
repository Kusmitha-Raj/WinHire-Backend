import { api } from './api';

export interface PanelistAvailability {
  id?: number;
  panelistId: number;
  availableDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  panelist?: any;
}

export const availabilityAPI = {
  getAll: async (): Promise<PanelistAvailability[]> => {
    const response = await api.get('/availability');
    return response.data;
  },

  getByPanelist: async (panelistId: number): Promise<PanelistAvailability[]> => {
    const response = await api.get(`/availability/panelist/${panelistId}`);
    return response.data;
  },

  getAvailablePanelists: async (date: string, startTime: string, endTime: string): Promise<any[]> => {
    const response = await api.get('/availability/available', {
      params: { date, startTime, endTime }
    });
    return response.data;
  },

  create: async (availability: PanelistAvailability): Promise<PanelistAvailability> => {
    const response = await api.post('/availability', availability);
    return response.data;
  },

  update: async (id: number, availability: PanelistAvailability): Promise<PanelistAvailability> => {
    const response = await api.put(`/availability/${id}`, availability);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/availability/${id}`);
  },
};
