import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Application {
  id?: number;
  candidateId: number;
  jobId: number;
  status: string;
  appliedDate?: string;
  notes?: string;
  candidate?: any;
  job?: any;
}

export const applicationAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/applications`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/applications/${id}`);
    return response.data;
  },

  getByCandidate: async (candidateId: number) => {
    const response = await axios.get(`${API_BASE_URL}/applications/candidate/${candidateId}`);
    return response.data;
  },

  getByJob: async (jobId: number) => {
    const response = await axios.get(`${API_BASE_URL}/applications/job/${jobId}`);
    return response.data;
  },

  create: async (application: Application) => {
    const response = await axios.post(`${API_BASE_URL}/applications`, application);
    return response.data;
  },

  update: async (id: number, application: Application) => {
    const response = await axios.put(`${API_BASE_URL}/applications/${id}`, application);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, { status });
    return response.data;
  },

  updateDecision: async (id: number, decision: string) => {
    const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, { status: decision });
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_BASE_URL}/applications/${id}`);
  }
};
