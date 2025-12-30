import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interviewAPI, type Interview } from '../api/interviewApi';
import { feedbackAPI } from '../api/feedbackApi';
import { availabilityAPI } from '../api/availabilityApi';

export default function PanelistDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('interviews');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  
  const [newFeedback, setNewFeedback] = useState({
    technicalSkillsRating: 5,
    problemSolvingRating: 5,
    communicationRating: 5,
    culturalFitRating: 5,
    overallRating: 5,
    recommendation: 'Maybe',
    comments: ''
  });

  const [newAvailability, setNewAvailability] = useState({
    date: '',
    startTime: '09:00',
    endTime: '17:00'
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [interviewData, availData] = await Promise.all([
        interviewAPI.getByInterviewer(user.id),
        availabilityAPI.getByPanelist(user.id)
      ]);
      setInterviews(interviewData);
      setAvailability(availData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview || !user) return;
    
    try {
      await feedbackAPI.create({
        interviewId: selectedInterview.id,
        applicationId: selectedInterview.applicationId,
        providedByUserId: user.id,
        ...newFeedback
      });
      
      setShowFeedbackForm(false);
      setSelectedInterview(null);
      setNewFeedback({
        technicalSkillsRating: 5,
        problemSolvingRating: 5,
        communicationRating: 5,
        culturalFitRating: 5,
        overallRating: 5,
        recommendation: 'Maybe',
        comments: ''
      });
      
      alert('Feedback submitted successfully!');
      loadData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      alert('Failed to submit feedback: ' + errorMsg);
      console.error('Feedback submission error:', err.response || err);
    }
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      // Convert date string to ISO format and times to TimeSpan format
      const dateObj = new Date(newAvailability.date);
      const isoDate = dateObj.toISOString();
      
      await availabilityAPI.create({
        panelistId: user.id,
        availableDate: isoDate,
        startTime: newAvailability.startTime + ':00', // Convert to HH:MM:SS
        endTime: newAvailability.endTime + ':00',
        status: 'Available'
      });
      
      setShowAvailabilityForm(false);
      setNewAvailability({
        date: '',
        startTime: '09:00',
        endTime: '17:00'
      });
      
      alert('Availability added successfully!');
      loadData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      alert('Failed to add availability: ' + errorMsg);
      console.error('Availability error:', err.response || err);
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;
    
    try {
      await availabilityAPI.delete(id);
      alert('Availability deleted successfully!');
      loadData();
    } catch (err) {
      alert('Failed to delete availability');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingInterviews = interviews.filter(i => 
    i.status?.toLowerCase() === 'scheduled' && new Date(i.scheduledDateTime) > new Date()
  );
  
  const completedInterviews = interviews.filter(i => 
    i.status?.toLowerCase() === 'completed' || new Date(i.scheduledDateTime) < new Date()
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Panelist Dashboard</h1>
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
            <h3 className="text-sm font-medium text-gray-500">Upcoming Interviews</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{upcomingInterviews.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Completed Interviews</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{completedInterviews.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Interviews</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{interviews.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'interviews', label: 'My Interviews' },
                { id: 'availability', label: 'My Availability' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* INTERVIEWS TAB */}
            {activeTab === 'interviews' && (
              <div>
                <h2 className="text-xl font-bold mb-6">My Interview Schedule</h2>
                
                {/* Upcoming Interviews */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">🔜 Upcoming Interviews</h3>
                  {upcomingInterviews.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingInterviews.map((interview) => (
                        <div key={interview.id} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg">{interview.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Candidate:</strong> {interview.application?.candidate?.name || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Date & Time:</strong> {new Date(interview.scheduledDateTime).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Type:</strong> {interview.type}
                              </p>
                              {interview.meetingLink && (
                                <p className="text-sm text-gray-600">
                                  <strong>Meeting Link:</strong>{' '}
                                  <a href={interview.meetingLink} target="_blank" className="text-blue-600 hover:underline">
                                    {interview.meetingLink}
                                  </a>
                                </p>
                              )}
                              {interview.location && (
                                <p className="text-sm text-gray-600">
                                  <strong>Location:</strong> {interview.location}
                                </p>
                              )}
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${getStatusColor(interview.status || 'scheduled')}`}>
                                {interview.status || 'Scheduled'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-600">📅 No upcoming interviews scheduled</p>
                    </div>
                  )}
                </div>

                {/* Completed Interviews */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Completed Interviews</h3>
                  {completedInterviews.length > 0 ? (
                    <div className="space-y-4">
                      {completedInterviews.map((interview) => {
                        const hasFeedback = interview.feedbacks && interview.feedbacks.length > 0;
                        return (
                          <div key={interview.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg">{interview.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  <strong>Candidate:</strong> {interview.application?.candidate?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Date & Time:</strong> {new Date(interview.scheduledDateTime).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {interview.type}
                                </p>
                                {hasFeedback ? (
                                  <p className="text-sm text-green-600 font-semibold mt-2">
                                    ✓ Feedback submitted
                                  </p>
                                ) : (
                                  <p className="text-sm text-yellow-600 font-semibold mt-2">
                                    ⚠️ Feedback pending
                                  </p>
                                )}
                              </div>
                              {!hasFeedback && (
                                <button
                                  onClick={() => {
                                    setSelectedInterview(interview);
                                    setShowFeedbackForm(true);
                                  }}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-4"
                                >
                                  Submit Feedback
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-600">No completed interviews yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AVAILABILITY TAB */}
            {activeTab === 'availability' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">My Availability Schedule</h2>
                  <button
                    onClick={() => setShowAvailabilityForm(!showAvailabilityForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {showAvailabilityForm ? 'Cancel' : '+ Add Availability'}
                  </button>
                </div>

                {showAvailabilityForm && (
                  <form onSubmit={handleAddAvailability} className="bg-blue-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
                    <h3 className="font-bold mb-4">Add New Availability Slot</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                          type="date"
                          required
                          value={newAvailability.date}
                          onChange={(e) => setNewAvailability({ ...newAvailability, date: e.target.value })}
                          className="border rounded px-3 py-2 w-full"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <input
                          type="time"
                          required
                          value={newAvailability.startTime}
                          onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <input
                          type="time"
                          required
                          value={newAvailability.endTime}
                          onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                    </div>
                    <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                      Add Availability
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availability.map((avail: any) => (
                        <tr key={avail.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(avail.availableDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{avail.startTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{avail.endTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteAvailability(avail.id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {availability.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No availability slots added yet. Click "Add Availability" to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackForm && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Submit Interview Feedback</h2>
                <button
                  onClick={() => { setShowFeedbackForm(false); setSelectedInterview(null); }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Interview Details</h3>
                <p><strong>Candidate:</strong> {selectedInterview.application?.candidate?.name || 'N/A'}</p>
                <p><strong>Interview:</strong> {selectedInterview.title}</p>
                <p><strong>Date:</strong> {new Date(selectedInterview.scheduledDateTime).toLocaleString()}</p>
              </div>

              <form onSubmit={handleSubmitFeedback}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Technical Skills (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={newFeedback.technicalSkillsRating}
                      onChange={(e) => setNewFeedback({ ...newFeedback, technicalSkillsRating: parseInt(e.target.value) })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Problem Solving (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={newFeedback.problemSolvingRating}
                      onChange={(e) => setNewFeedback({ ...newFeedback, problemSolvingRating: parseInt(e.target.value) })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Communication (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={newFeedback.communicationRating}
                      onChange={(e) => setNewFeedback({ ...newFeedback, communicationRating: parseInt(e.target.value) })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cultural Fit (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={newFeedback.culturalFitRating}
                      onChange={(e) => setNewFeedback({ ...newFeedback, culturalFitRating: parseInt(e.target.value) })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Overall Rating (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={newFeedback.overallRating}
                      onChange={(e) => setNewFeedback({ ...newFeedback, overallRating: parseInt(e.target.value) })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Recommendation</label>
                    <select
                      value={newFeedback.recommendation}
                      onChange={(e) => setNewFeedback({ ...newFeedback, recommendation: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value="Hire">Hire</option>
                      <option value="Maybe">Maybe</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Comments</label>
                    <textarea
                      value={newFeedback.comments}
                      onChange={(e) => setNewFeedback({ ...newFeedback, comments: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                      rows={4}
                      placeholder="Provide detailed feedback about the candidate's performance..."
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowFeedbackForm(false); setSelectedInterview(null); }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Submit Feedback
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
