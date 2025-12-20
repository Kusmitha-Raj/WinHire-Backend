import { api } from './api';

export interface Interview {
  id?: number;
  applicationId: number;
  interviewerId?: number;
  scheduledDateTime: string;
  type: string;
  status: string;
  meetingLink?: string;
  notes?: string;
  application?: any;
  interviewer?: any;
}

export const interviewAPI = {
  getAll: async (): Promise<Interview[]> => {
    const response = await api.get('/interviews');
    return response.data;
  },

  getById: async (id: number): Promise<Interview> => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },

  create: async (interview: Interview): Promise<Interview> => {
    const response = await api.post('/interviews', interview);
    return response.data;
  },

  update: async (id: number, interview: Interview): Promise<Interview> => {
    const response = await api.put(`/interviews/${id}`, interview);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/interviews/${id}`);
  },
};
