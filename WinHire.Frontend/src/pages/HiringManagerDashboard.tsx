import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { candidateAPI, type Candidate } from '../api/candidateApi';
import { feedbackAPI } from '../api/feedbackApi';
import { applicationAPI } from '../api/applicationApi';

export default function HiringManagerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const apps = await applicationAPI.getAll();
      setApplications(apps || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleViewDetails = async (app: any) => {
    try {
      const detailed = await candidateAPI.getDetails(app.candidateId);
      setSelectedApplication({ ...app, candidateDetails: detailed });
      setShowDetailsModal(true);
    } catch (err) {
      alert('Failed to load candidate details');
      console.error(err);
    }
  };

  const handleDecision = async (applicationId: number, decision: 'Selected' | 'Rejected') => {
    try {
      await applicationAPI.updateStatus(applicationId, decision);
      alert(`Candidate ${decision.toLowerCase()} successfully!`);
      loadData();
      setShowDetailsModal(false);
    } catch (err: any) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const getApplicationsWithFeedback = () => {
    return applications.filter(app => 
      app.interviews && app.interviews.some((i: any) => i.feedbacks && i.feedbacks.length > 0)
    );
  };

  const getPendingApplications = () => {
    return applications.filter(app => 
      app.status !== 'Selected' && app.status !== 'Rejected'
    );
  };

  const getAverageRating = (feedbacks: any[]) => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, f) => sum + (f.overallRating || 0), 0);
    return (total / feedbacks.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Hiring Manager Dashboard</h1>
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
            <h3 className="text-sm font-medium text-gray-500">Selected</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{applications.filter(a => a.status === 'Selected').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{applications.filter(a => a.status === 'Rejected').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['applications', 'pending-decisions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'applications' ? 'All Applications' : 'Pending Decisions'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* All Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <h2 className="text-xl font-bold mb-4">All Applications</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((app: any) => {
                        return (
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleViewDetails(app)}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pending Decisions Tab */}
            {activeTab === 'pending-decisions' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Candidates Pending Decision</h2>
                <div className="space-y-4">
                  {getPendingApplications().map((app: any) => {
                    return (
                      <div key={app.id} className="border rounded-lg p-6 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{app.candidate?.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Job:</strong> {app.job?.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Email:</strong> {app.candidate?.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Phone:</strong> {app.candidate?.phone}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => handleViewDetails(app)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                            >
                              View Full Details
                            </button>
                            <button
                              onClick={() => handleDecision(app.id, 'Selected')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
                            >
                              Select Candidate
                            </button>
                            <button
                              onClick={() => handleDecision(app.id, 'Rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {getPendingApplications().length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No pending decisions</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && selectedApplication.candidateDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedApplication.candidate?.name} - Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Candidate Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Candidate Information</h3>
                <p><strong>Email:</strong> {selectedApplication.candidate?.email}</p>
                <p><strong>Phone:</strong> {selectedApplication.candidate?.phone}</p>
                <p><strong>Skills:</strong> {selectedApplication.candidate?.skills}</p>
                <p><strong>Experience:</strong> {selectedApplication.candidate?.experience} years</p>
                <p><strong>Status:</strong> {selectedApplication.status}</p>
              </div>

              {/* Interviews & Feedback */}
              <div>
                <h3 className="font-bold text-xl mb-4">Applications & Interviews</h3>
                {selectedApplication.candidateDetails.applications && selectedApplication.candidateDetails.applications.length > 0 ? (
                  selectedApplication.candidateDetails.applications.map((application: any) => (
                    <div key={application.id} className="mb-8 p-4 border-2 border-gray-300 rounded-lg">
                      <h4 className="font-bold text-lg mb-3">Application for: {application.jobTitle || 'N/A'}</h4>
                      <p className="text-sm text-gray-600 mb-4">Status: {application.status} | Round: {application.currentRound || 1}</p>
                      
                      {/* Interviews */}
                      {application.interviews && application.interviews.length > 0 ? (
                        <div>
                          <h5 className="font-semibold text-md mb-3">Interviews Attended:</h5>
                          {application.interviews.map((interview: any) => (
                            <div key={interview.id} className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="mb-2">
                                <h5 className="font-bold text-blue-900">{interview.title || 'Interview'}</h5>
                                <p className="text-sm text-gray-700"><strong>Date:</strong> {new Date(interview.scheduledDateTime).toLocaleString()}</p>
                                <p className="text-sm text-gray-700"><strong>Type:</strong> {interview.type} | <strong>Status:</strong> {interview.status}</p>
                                {interview.interviewer && (
                                  <p className="text-sm text-gray-700"><strong>Interviewer:</strong> {interview.interviewer.name}</p>
                                )}
                                {interview.meetingLink && (
                                  <p className="text-sm text-gray-700"><strong>Meeting Link:</strong> <a href={interview.meetingLink} target="_blank" className="text-blue-600 hover:underline">{interview.meetingLink}</a></p>
                                )}
                                {interview.location && (
                                  <p className="text-sm text-gray-700"><strong>Location:</strong> {interview.location}</p>
                                )}
                              </div>

                              {/* Feedback for this interview */}
                              {interview.feedbacks && interview.feedbacks.length > 0 ? (
                                <div className="mt-3">
                                  <h6 className="font-semibold mb-2 text-green-800">Feedback Received:</h6>
                                  {interview.feedbacks.map((feedback: any) => (
                                    <div key={feedback.id} className="bg-white p-3 rounded border border-green-300 mb-2">
                                      <p className="mb-1"><strong>Provided By:</strong> {feedback.providedBy?.name || 'Anonymous'} ({feedback.providedBy?.email || 'N/A'})</p>
                                      <div className="grid grid-cols-2 gap-2 my-2">
                                        <p className="text-sm"><strong>Technical Skills:</strong> {feedback.technicalSkillsRating}/10</p>
                                        <p className="text-sm"><strong>Problem Solving:</strong> {feedback.problemSolvingRating}/10</p>
                                        <p className="text-sm"><strong>Communication:</strong> {feedback.communicationRating}/10</p>
                                        <p className="text-sm"><strong>Cultural Fit:</strong> {feedback.culturalFitRating}/10</p>
                                      </div>
                                      <p className="font-bold text-lg mt-2">
                                        <strong>Overall Rating:</strong> <span className={`${feedback.overallRating >= 7 ? 'text-green-600' : feedback.overallRating >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>{feedback.overallRating}/10</span>
                                      </p>
                                      {feedback.comments && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded">
                                          <p className="text-sm"><strong>Comments:</strong></p>
                                          <p className="text-sm mt-1">{feedback.comments}</p>
                                        </div>
                                      )}
                                      <p className="text-sm mt-2">
                                        <strong>Recommendation:</strong> <span className={`font-semibold ${feedback.recommendation === 'Hire' ? 'text-green-600' : feedback.recommendation === 'Reject' ? 'text-red-600' : 'text-yellow-600'}`}>{feedback.recommendation || 'N/A'}</span>
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Submitted: {new Date(feedback.createdAt).toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-yellow-700 text-sm mt-2 bg-yellow-50 p-2 rounded">⚠️ No feedback submitted yet for this interview.</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-gray-600 text-lg">📅 No interviews yet for this application.</p>
                          <p className="text-gray-500 text-sm mt-2">Interviews will appear here once they are scheduled.</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 text-xl">📋 No applications found for this candidate.</p>
                    <p className="text-gray-500 text-sm mt-2">Applications will appear here once the candidate applies for jobs.</p>
                  </div>
                )}
              </div>

              {/* Decision Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedApplication.status !== 'Selected' && selectedApplication.status !== 'Rejected' && (
                  <>
                    <button
                      onClick={() => handleDecision(selectedApplication.id, 'Rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject Candidate
                    </button>
                    <button
                      onClick={() => handleDecision(selectedApplication.id, 'Selected')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Select Candidate
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
