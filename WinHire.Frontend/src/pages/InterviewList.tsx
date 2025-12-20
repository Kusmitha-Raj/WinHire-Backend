import { useState, useEffect } from 'react';
import { interviewAPI, type Interview } from '../api/interviewApi';
import { applicationAPI, type Application } from '../api/applicationApi';
import { userAPI, type User } from '../api/userApi';

export default function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState<Interview>({
    applicationId: 0,
    interviewerId: 0,
    scheduledDateTime: '',
    type: 'Technical',
    status: 'Scheduled',
    meetingLink: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [interviewsData, appsData, usersData] = await Promise.all([
        interviewAPI.getAll(),
        applicationAPI.getAll(),
        userAPI.getAll(),
      ]);
      setInterviews(interviewsData);
      setApplications(appsData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to load interviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await interviewAPI.create(formData);
      resetForm();
      loadData();
    } catch (err) {
      alert('Failed to create interview');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const interview = interviews.find((i) => i.id === id);
      if (interview) {
        await interviewAPI.update(id, { ...interview, status });
        loadData();
      }
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await interviewAPI.delete(id);
        loadData();
      } catch (err) {
        alert('Failed to delete interview');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      applicationId: 0,
      interviewerId: 0,
      scheduledDateTime: '',
      type: 'Technical',
      status: 'Scheduled',
      meetingLink: '',
    });
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Scheduled: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
      Rescheduled: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading interviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">{interviews.length} total interviews</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          + Schedule Interview
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
            <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Application</label>
                <select
                  required
                  value={formData.applicationId}
                  onChange={(e) => setFormData({ ...formData, applicationId: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Select Application</option>
                  {applications.filter((a) => ['Applied', 'Screening', 'Interview'].includes(a.status)).map((a) => (
                    <option key={a.id} value={a.id}>
                      Application #{a.id} - Status: {a.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interviewer</label>
                <select
                  value={formData.interviewerId || 0}
                  onChange={(e) => setFormData({ ...formData, interviewerId: Number(e.target.value) || undefined })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Unassigned</option>
                  {users.filter((u) => ['HiringManager', 'Panelist'].includes(u.role)).map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledDateTime}
                  onChange={(e) => setFormData({ ...formData, scheduledDateTime: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interview Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Technical">Technical</option>
                  <option value="HR">HR</option>
                  <option value="Managerial">Managerial</option>
                  <option value="Final">Final</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Meeting Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interviews Grid */}
      <div className="grid gap-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(interview.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{interview.type} Interview</h3>
                    <p className="text-sm text-gray-500">Application #{interview.applicationId}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(interview.scheduledDateTime).toLocaleString()}
                  </p>
                  {interview.meetingLink && (
                    <p className="text-sm">
                      <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        🔗 Join Meeting
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <select
                  value={interview.status}
                  onChange={(e) => handleStatusUpdate(interview.id!, e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
                <button
                  onClick={() => handleDelete(interview.id!)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {interviews.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No interviews scheduled</p>
        </div>
      )}
    </div>
  );
}
