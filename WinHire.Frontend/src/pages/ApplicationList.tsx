import { useState, useEffect } from 'react';
import { applicationAPI, type Application } from '../api/applicationApi';
import { candidateAPI, type Candidate } from '../api/candidateApi';
import { jobAPI, type Job } from '../api/jobApi';

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState<Application>({
    candidateId: 0,
    jobId: 0,
    status: 'Applied',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsData, candidatesData, jobsData] = await Promise.all([
        applicationAPI.getAll(),
        candidateAPI.getAll(),
        jobAPI.getAll(),
      ]);
      setApplications(appsData);
      setCandidates(candidatesData);
      setJobs(jobsData);
      setError(null);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applicationAPI.create(formData);
      resetForm();
      loadData();
    } catch (err) {
      alert('Failed to create application');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const app = applications.find((a) => a.id === id);
      if (app) {
        await applicationAPI.update(id, { ...app, status });
        loadData();
      }
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationAPI.delete(id);
        loadData();
      } catch (err) {
        alert('Failed to delete application');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      candidateId: 0,
      jobId: 0,
      status: 'Applied',
    });
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Applied: 'bg-blue-100 text-blue-800',
      Screening: 'bg-yellow-100 text-yellow-800',
      Interview: 'bg-purple-100 text-purple-800',
      Offered: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Accepted: 'bg-green-200 text-green-900',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCandidateName = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate?.name || `Candidate ${candidateId}`;
  };

  const getJobTitle = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    return job?.title || `Job ${jobId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">{applications.length} total applications</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          + Add Application
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Candidate</label>
                <select
                  required
                  value={formData.candidateId}
                  onChange={(e) => setFormData({ ...formData, candidateId: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Select Candidate</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job</label>
                <select
                  required
                  value={formData.jobId}
                  onChange={(e) => setFormData({ ...formData, jobId: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Select Job</option>
                  {jobs.filter((j) => j.status === 'Open').map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} - {j.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getCandidateName(app.candidateId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getJobTitle(app.jobId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app.id!, e.target.value)}
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(app.status)}`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleDelete(app.id!)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {applications.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No applications found</p>
        </div>
      )}
    </div>
  );
}
