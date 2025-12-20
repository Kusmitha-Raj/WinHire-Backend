import React, { useState, useEffect } from 'react';
import { candidateAPI, type Candidate, AllStatuses, CandidateStatus } from '../api/candidateApi';

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Candidate>({
    name: '',
    email: '',
    phone: '',
    roleApplied: '',
    status: ''
  });

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidateAPI.getAll();
      setCandidates(data);
      setError(null);
    } catch (err) {
      setError('Failed to load candidates. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await candidateAPI.create(newCandidate);
      setNewCandidate({ name: '', email: '', phone: '', roleApplied: '', status: '' });
      setShowAddForm(false);
      loadCandidates();
    } catch (err) {
      alert('Failed to add candidate');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await candidateAPI.updateStatus(id, status);
      loadCandidates();
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidateAPI.delete(id);
        loadCandidates();
      } catch (err) {
        alert('Failed to delete candidate');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case CandidateStatus.ApplicationReceived:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case CandidateStatus.UnderReview:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case CandidateStatus.Shortlisted:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case CandidateStatus.InterviewScheduled:
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case CandidateStatus.Selected:
        return 'bg-green-100 text-green-800 border-green-300';
      case CandidateStatus.Rejected:
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusCounts = () => {
    return {
      total: candidates.length,
      applicationReceived: candidates.filter(c => c.status === CandidateStatus.ApplicationReceived).length,
      underReview: candidates.filter(c => c.status === CandidateStatus.UnderReview).length,
      shortlisted: candidates.filter(c => c.status === CandidateStatus.Shortlisted).length,
      interviewScheduled: candidates.filter(c => c.status === CandidateStatus.InterviewScheduled).length,
      selected: candidates.filter(c => c.status === CandidateStatus.Selected).length,
      rejected: candidates.filter(c => c.status === CandidateStatus.Rejected).length,
      noStatus: candidates.filter(c => !c.status || c.status === '').length,
    };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">WinHire</h1>
          <p className="text-gray-600">Candidate Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-500">
            <div className="text-2xl font-bold text-gray-900">{counts.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
            <div className="text-2xl font-bold text-gray-700">{counts.noStatus}</div>
            <div className="text-sm text-gray-600">No Status</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-500">
            <div className="text-2xl font-bold text-gray-700">{counts.applicationReceived}</div>
            <div className="text-sm text-gray-600">Received</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-700">{counts.underReview}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-700">{counts.shortlisted}</div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-700">{counts.interviewScheduled}</div>
            <div className="text-sm text-gray-600">Interview</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-700">{counts.selected}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-700">{counts.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            {showAddForm ? '✕ Cancel' : '+ Add New Candidate'}
          </button>
          <button
            onClick={loadCandidates}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Add Candidate Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Candidate</h2>
            <form onSubmit={handleAddCandidate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Applied *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newCandidate.roleApplied}
                  onChange={(e) => setNewCandidate({ ...newCandidate, roleApplied: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Candidates Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="text-xl mb-4 font-semibold text-gray-400">No Candidates</div>
                      <div className="text-lg font-semibold">No candidates yet</div>
                      <div className="text-sm">Add your first candidate to get started</div>
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.roleApplied}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={candidate.status || ''}
                          onChange={(e) => candidate.id && handleStatusUpdate(candidate.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(candidate.status)}`}
                        >
                          <option value="">-- No Status --</option>
                          {AllStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {candidate.createdOn ? new Date(candidate.createdOn).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => candidate.id && handleDelete(candidate.id)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>💡 Tip: Agents automatically update candidate statuses every minute</p>
          <p className="mt-2">When a candidate is marked as "Selected", they will receive an email automatically</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
