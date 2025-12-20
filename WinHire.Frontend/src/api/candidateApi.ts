import { api } from './api';

export interface Candidate {
  id?: number;
  name: string;
  email: string;
  phone: string;
  roleApplied: string;
  status: string;
  createdOn?: string;
}

export const candidateAPI = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await api.get('/candidates');
    return response.data;
  },

  getById: async (id: number): Promise<Candidate> => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  create: async (candidate: Candidate): Promise<Candidate> => {
    const response = await api.post('/candidates', candidate);
    return response.data;
  },

  update: async (id: number, candidate: Candidate): Promise<Candidate> => {
    const response = await api.put(`/candidates/${id}`, candidate);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<Candidate> => {
    const response = await api.put(`/candidates/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/candidates/${id}`);
  }
};

export const CandidateStatus = {
  ApplicationReceived: "Application Received",
  UnderReview: "Under Review",
  Shortlisted: "Shortlisted",
  InterviewScheduled: "Interview Scheduled",
  Selected: "Selected",
  Rejected: "Rejected"
};

export const AllStatuses = [
  CandidateStatus.ApplicationReceived,
  CandidateStatus.UnderReview,
  CandidateStatus.Shortlisted,
  CandidateStatus.InterviewScheduled,
  CandidateStatus.Selected,
  CandidateStatus.Rejected
];
