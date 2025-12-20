import { api } from './api';

export interface Application {
  id?: number;
  candidateId: number;
  jobId: number;
  recruiterId?: number;
  status: string;
  appliedDate?: string;
  resumeUrl?: string;
  coverLetter?: string;
  candidate?: any;
  job?: any;
  recruiter?: any;
}

export const applicationAPI = {
  getAll: async (): Promise<Application[]> => {
    const response = await api.get('/applications');
    return response.data;
  },

  getById: async (id: number): Promise<Application> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  create: async (application: Application): Promise<Application> => {
    const response = await api.post('/applications', application);
    return response.data;
  },

  update: async (id: number, application: Application): Promise<Application> => {
    const response = await api.put(`/applications/${id}`, application);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/applications/${id}`);
  },
};
