import { api } from './api';

export interface Job {
  id?: number;
  title: string;
  description: string;
  department: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  minExperience?: number;
  maxExperience?: number;
  requiredSkills?: string;
  status: string;
  hiringManagerId?: number;
  hiringManager?: any;
  postedDate?: string;
}

export const jobAPI = {
  getAll: async (): Promise<Job[]> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  getById: async (id: number): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  create: async (job: Job): Promise<Job> => {
    const response = await api.post('/jobs', job);
    return response.data;
  },

  update: async (id: number, job: Job): Promise<Job> => {
    const response = await api.put(`/jobs/${id}`, job);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },
};
