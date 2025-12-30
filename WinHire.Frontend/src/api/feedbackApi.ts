import { api } from './api';

export interface Feedback {
  id?: number;
  interviewId?: number;
  applicationId?: number;
  providedByUserId: number;
  technicalSkillsRating?: number;
  problemSolvingRating?: number;
  communicationRating?: number;
  culturalFitRating?: number;
  overallRating?: number;
  recommendation: string;
  comments: string;
  createdAt?: string;
  providedBy?: any;
}

export const feedbackAPI = {
  getAll: async (): Promise<Feedback[]> => {
    const response = await api.get('/feedback');
    return response.data;
  },

  getById: async (id: number): Promise<Feedback> => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  getByInterview: async (interviewId: number): Promise<Feedback[]> => {
    const response = await api.get(`/feedback/interview/${interviewId}`);
    return response.data;
  },

  getByApplication: async (applicationId: number): Promise<Feedback[]> => {
    const response = await api.get(`/feedback/application/${applicationId}`);
    return response.data;
  },

  create: async (feedback: Feedback): Promise<Feedback> => {
    const response = await api.post('/feedback', feedback);
    return response.data;
  },

  update: async (id: number, feedback: Feedback): Promise<Feedback> => {
    const response = await api.put(`/feedback/${id}`, feedback);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};
