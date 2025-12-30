import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Interview {
  id?: number;
  applicationId: number;
  title: string;
  type: string;
  scheduledDateTime: string;
  durationMinutes?: number;
  meetingLink?: string;
  location?: string;
  status?: string;
  interviewerId?: number;
  notes?: string;
  application?: any;
  interviewer?: any;
  feedbacks?: any[];
}

export const interviewAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/interviews`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/interviews/${id}`);
    return response.data;
  },

  getByApplication: async (applicationId: number) => {
    const response = await axios.get(`${API_BASE_URL}/interviews/application/${applicationId}`);
    return response.data;
  },

  getByInterviewer: async (interviewerId: number) => {
    const response = await axios.get(`${API_BASE_URL}/interviews/interviewer/${interviewerId}`);
    return response.data;
  },

  create: async (interview: Interview) => {
    const response = await axios.post(`${API_BASE_URL}/interviews`, interview);
    return response.data;
  },

  update: async (id: number, interview: Interview) => {
    const response = await axios.put(`${API_BASE_URL}/interviews/${id}`, interview);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await axios.put(`${API_BASE_URL}/interviews/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_BASE_URL}/interviews/${id}`);
  }
};
