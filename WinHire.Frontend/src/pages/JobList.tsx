import { useState, useEffect } from 'react';
import { jobAPI, type Job } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState<Job>({
    title: '',
    description: '',
    department: '',
    location: '',
    minSalary: 0,
    maxSalary: 0,
    minExperience: 0,
    maxExperience: 0,
    requiredSkills: '',
    status: 'Open',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getAll();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob?.id) {
        await jobAPI.update(editingJob.id, formData);
      } else {
        await jobAPI.create(formData);
      }
      resetForm();
      loadJobs();
    } catch (err) {
      alert('Failed to save job');
      console.error(err);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData(job);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.delete(id);
        loadJobs();
      } catch (err) {
        alert('Failed to delete job');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      minSalary: 0,
      maxSalary: 0,
      minExperience: 0,
      maxExperience: 0,
      requiredSkills: '',
      status: 'Open',
    });
    setEditingJob(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      case 'OnHold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1">{jobs.length} total jobs</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'HiringManager') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            + Add Job
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingJob ? 'Edit Job' : 'Add New Job'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Salary</label>
                  <input
                    type="number"
                    value={formData.minSalary}
                    onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Salary</label>
                  <input
                    type="number"
                    value={formData.maxSalary}
                    onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Experience (years)</label>
                  <input
                    type="number"
                    value={formData.minExperience}
                    onChange={(e) => setFormData({ ...formData, minExperience: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Experience (years)</label>
                  <input
                    type="number"
                    value={formData.maxExperience}
                    onChange={(e) => setFormData({ ...formData, maxExperience: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, TypeScript"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="OnHold">On Hold</option>
                  </select>
                </div>
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
                  {editingJob ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>{job.location} • {job.department}</p>
                  {job.minSalary && job.maxSalary && (
                    <p>${job.minSalary?.toLocaleString()} - ${job.maxSalary?.toLocaleString()}</p>
                  )}
                  {job.minExperience !== undefined && job.maxExperience !== undefined && (
                    <p>{job.minExperience}-{job.maxExperience} years experience</p>
                  )}
                  {job.requiredSkills && (
                    <p>{job.requiredSkills}</p>
                  )}
                  <p className="text-gray-500 mt-2">{job.description}</p>
                </div>
              </div>
              {(user?.role === 'Admin' || user?.role === 'HiringManager') && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(job)}
                    className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id!)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No jobs found</p>
        </div>
      )}
    </div>
  );
}
