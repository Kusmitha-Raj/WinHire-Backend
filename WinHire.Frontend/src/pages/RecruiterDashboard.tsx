import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { candidateAPI, type Candidate } from '../api/candidateApi';
import { interviewAPI, type Interview } from '../api/interviewApi';
import { availabilityAPI } from '../api/availabilityApi';
import { applicationAPI } from '../api/applicationApi';
import { userAPI } from '../api/userApi';

export default function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [panelists, setPanelists] = useState<any[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [panelistAvailability, setPanelistAvailability] = useState<any[]>([]);
  const [availabilityError, setAvailabilityError] = useState<string>('');
  const [newInterview, setNewInterview] = useState({
    title: '',
    type: 'Technical',
    scheduledDateTime: '',
    durationMinutes: 60,
    meetingLink: '',
    location: '',
    interviewerId: 0
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'applications') {
        const apps = await applicationAPI.getAll();
        setApplications(apps || []);
      } else if (activeTab === 'interviews') {
        const ints = await interviewAPI.getAll();
        setInterviews(ints || []);
      }
      // Load all panelists for scheduling
      const users = await userAPI.getAll();
      setPanelists(users.filter((u: any) => u.role === 'Panelist') || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const getFilteredPanelists = () => {
    if (!newInterview.type) return panelists;
    
    // Filter panelists by specialization matching the interview type
    return panelists.filter((p: any) => {
      if (!p.specialization) return true; // Include panelists with no specialization set
      const specializations = p.specialization.split(',').map((s: string) => s.trim().toLowerCase());
      return specializations.includes(newInterview.type.toLowerCase());
    });
  };

  const loadPanelistAvailability = async (panelistId: number) => {
    try {
      const availability = await availabilityAPI.getByPanelist(panelistId);
      setPanelistAvailability(availability || []);
      checkAvailability(newInterview.scheduledDateTime, panelistId, availability);
    } catch (err) {
      console.error('Failed to load availability:', err);
      setPanelistAvailability([]);
    }
  };

  const checkAvailability = (dateTime: string, panelistId: number, availability?: any[]) => {
    if (!dateTime || !panelistId) {
      setAvailabilityError('');
      return;
    }

    const avail = availability || panelistAvailability;
    if (avail.length === 0) {
      setAvailabilityError('⚠️ This panelist has not set any availability');
      return;
    }

    const interviewDate = new Date(dateTime);
    const interviewTime = interviewDate.toTimeString().substring(0, 8); // HH:MM:SS
    const interviewDateOnly = interviewDate.toISOString().split('T')[0];

    // Check if there's an availability slot for this date
    const matchingSlots = avail.filter((slot: any) => {
      const slotDate = new Date(slot.availableDate).toISOString().split('T')[0];
      return slotDate === interviewDateOnly && slot.status === 'Available';
    });

    if (matchingSlots.length === 0) {
      setAvailabilityError(`⚠️ Panelist is not available on ${interviewDate.toLocaleDateString()}`);
      return;
    }

    // Check if interview time falls within any available time slot
    const isWithinSlot = matchingSlots.some((slot: any) => {
      const startTime = slot.startTime;
      const endTime = slot.endTime;
      return interviewTime >= startTime && interviewTime < endTime;
    });

    if (!isWithinSlot) {
      const availableTimes = matchingSlots.map((s: any) => `${s.startTime} - ${s.endTime}`).join(', ');
      setAvailabilityError(`⚠️ Panelist is not available at this time. Available slots: ${availableTimes}`);
    } else {
      setAvailabilityError('');
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;

    // Final availability check
    if (availabilityError) {
      alert('Cannot schedule interview: ' + availabilityError);
      return;
    }

    try {
      await interviewAPI.create({
        applicationId: selectedApplication.id,
        title: newInterview.title,
        type: newInterview.type,
        scheduledDateTime: newInterview.scheduledDateTime,
        durationMinutes: newInterview.durationMinutes,
        meetingLink: newInterview.meetingLink,
        location: newInterview.location,
        interviewerId: newInterview.interviewerId,
        status: 'Scheduled'
      });

      setShowScheduleForm(false);
      setSelectedApplication(null);
      setPanelistAvailability([]);
      setAvailabilityError('');
      setNewInterview({
        title: '',
        type: 'Technical',
        scheduledDateTime: '',
        durationMinutes: 60,
        meetingLink: '',
        location: '',
        interviewerId: 0
      });
      alert('Interview scheduled successfully!');
      loadData();
    } catch (err: any) {
      alert('Failed to schedule interview: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Scheduled Interviews</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{interviews.filter(i => i.status === 'Scheduled').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Available Panelists</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{panelists.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['applications', 'interviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Applications</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((app: any) => (
                        <tr key={app.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{app.candidate?.name || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{app.job?.title || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              app.status === 'Selected' ? 'bg-green-100 text-green-800' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              app.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(app.appliedDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setNewInterview({
                                  ...newInterview,
                                  title: `${app.job?.title} Interview - ${app.candidate?.name}`
                                });
                                setShowScheduleForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Schedule Interview
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Interviews Tab */}
            {activeTab === 'interviews' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Scheduled Interviews</h2>
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{interview.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Candidate:</strong> {interview.application?.candidate?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Type:</strong> {interview.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Date & Time:</strong> {new Date(interview.scheduledDateTime).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {interview.durationMinutes} minutes
                          </p>
                          {interview.meetingLink && (
                            <p className="text-sm text-gray-600">
                              <strong>Link:</strong> <a href={interview.meetingLink} className="text-blue-600" target="_blank" rel="noopener noreferrer">{interview.meetingLink}</a>
                            </p>
                          )}
                          <p className="text-sm mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              interview.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {interview.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {interviews.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No interviews scheduled yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleForm && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Schedule Interview</h2>
                <button
                  onClick={() => { setShowScheduleForm(false); setSelectedApplication(null); }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p><strong>Candidate:</strong> {selectedApplication.candidate?.name}</p>
                <p><strong>Job:</strong> {selectedApplication.job?.title}</p>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Interview Title</label>
                  <input
                    type="text"
                    required
                    value={newInterview.title}
                    onChange={(e) => setNewInterview({ ...newInterview, title: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Interview Type</label>
                  <select
                    value={newInterview.type}
                    onChange={(e) => {
                      setNewInterview({ ...newInterview, type: e.target.value, interviewerId: 0 });
                      setPanelistAvailability([]);
                      setAvailabilityError('');
                    }}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Panelists will be filtered based on this interview type</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Select Panelist</label>
                  <select
                    required
                    value={newInterview.interviewerId}
                    onChange={(e) => {
                      const panelistId = parseInt(e.target.value);
                      setNewInterview({ ...newInterview, interviewerId: panelistId });
                      if (panelistId > 0) {
                        loadPanelistAvailability(panelistId);
                      } else {
                        setPanelistAvailability([]);
                        setAvailabilityError('');
                      }
                    }}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value={0}>Select a panelist...</option>
                    {getFilteredPanelists().map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.email})
                        {p.specialization && ` - ${p.specialization}`}
                      </option>
                    ))}
                  </select>
                  {getFilteredPanelists().length === 0 && (
                    <p className="text-xs text-yellow-600 mt-1">⚠️ No panelists found with {newInterview.type} specialization</p>
                  )}
                  {getFilteredPanelists().length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Showing {getFilteredPanelists().length} panelist(s) with {newInterview.type} expertise
                    </p>
                  )}
                </div>

                {/* Show Panelist Availability */}
                {newInterview.interviewerId > 0 && panelistAvailability.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-semibold mb-2">📅 Available Time Slots:</p>
                    <div className="space-y-1">
                      {panelistAvailability.map((slot: any) => (
                        <p key={slot.id} className="text-sm">
                          • {new Date(slot.availableDate).toLocaleDateString()} - {slot.startTime} to {slot.endTime}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {newInterview.interviewerId > 0 && panelistAvailability.length === 0 && (
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm text-yellow-800">⚠️ This panelist has not set any availability yet</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newInterview.scheduledDateTime}
                    onChange={(e) => {
                      setNewInterview({ ...newInterview, scheduledDateTime: e.target.value });
                      checkAvailability(e.target.value, newInterview.interviewerId);
                    }}
                    className="border rounded px-3 py-2 w-full"
                  />
                  {availabilityError && (
                    <p className="text-sm text-red-600 mt-1">{availabilityError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    min={15}
                    step={15}
                    value={newInterview.durationMinutes}
                    onChange={(e) => setNewInterview({ ...newInterview, durationMinutes: parseInt(e.target.value) })}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Meeting Link (optional)</label>
                  <input
                    type="url"
                    value={newInterview.meetingLink}
                    onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location (optional)</label>
                  <input
                    type="text"
                    value={newInterview.location}
                    onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Conference Room 3 or Online"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowScheduleForm(false); setSelectedApplication(null); }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Schedule Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
