import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../api/candidateApi';
import { applicationAPI } from '../api/applicationApi';
import { feedbackAPI, type Feedback } from '../api/feedbackApi';
import { interviewAPI, type Interview } from '../api/interviewApi';
import { userAPI } from '../api/userApi';

interface CandidateDetails {
  candidate: any;
  applications: any[];
}

const CandidateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [panelists, setPanelists] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const isPanelist = currentUser?.role === 'Panelist';
  const isManagerOrRecruiter = currentUser && ['Admin', 'Recruiter', 'HiringManager'].includes(currentUser?.role);

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState<Feedback>({
    interviewId: 0,
    applicationId: 0,
    providedByUserId: 1,
    technicalSkillsRating: 3,
    problemSolvingRating: 3,
    communicationRating: 3,
    culturalFitRating: 3,
    overallRating: 3,
    recommendation: 'Pending',
    comments: ''
  });

  // Interview scheduling form state
  const [interviewForm, setInterviewForm] = useState<Interview>({
    applicationId: 0,
    title: '',
    type: 'Technical',
    scheduledDateTime: '',
    durationMinutes: 60,
    status: 'Scheduled',
    meetingLink: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
    loadPanelists();
    // Load current user from localStorage or context
    const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
    setCurrentUser(user);
    setFeedbackForm(prev => ({ ...prev, providedByUserId: user.id }));
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await candidateAPI.getDetails(parseInt(id!));
      setDetails(data);
      setError(null);
    } catch (err) {
      setError('Failed to load candidate details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPanelists = async () => {
    try {
      const data = await userAPI.getPanelists();
      setPanelists(data);
    } catch (err) {
      console.error('Failed to load panelists', err);
    }
  };

  const handleScheduleInterview = (application: any) => {
    const interviewCount = (application.interviews?.length || 0) + 1;
    setInterviewForm({
      applicationId: application.id,
      title: `${application.jobTitle} - Interview ${interviewCount}`,
      type: 'Technical',
      scheduledDateTime: '',
      durationMinutes: 60,
      status: 'Scheduled',
      meetingLink: '',
      location: '',
      notes: ''
    });
    setShowScheduleForm(true);
  };

  const handleSubmitInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!interviewForm.scheduledDateTime) {
        alert('Please select a date and time for the interview');
        return;
      }

      // Convert datetime-local to ISO format and remove id field
      const { id, ...interviewData } = interviewForm as any;
      const formattedInterview = {
        ...interviewData,
        scheduledDateTime: new Date(interviewForm.scheduledDateTime).toISOString()
      };
      
      console.log('Submitting interview:', formattedInterview);
      await interviewAPI.create(formattedInterview);
      setShowScheduleForm(false);
      loadData();
      alert('Interview scheduled successfully!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to schedule interview';
      alert(errorMsg);
      console.error('Schedule interview error:', err.response?.data || err);
    }
  };

  const handleAddFeedback = (interview: any, application: any) => {
    setSelectedInterview(interview);
    setFeedbackForm({
      interviewId: interview.id,
      applicationId: application.id,
      providedByUserId: currentUser?.id || 1,
      technicalSkillsRating: 3,
      communicationRating: 3,
      problemSolvingRating: 3,
      culturalFitRating: 3,
      overallRating: 3,
      comments: '',
      recommendation: 'Pending'
    });
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!feedbackForm.comments || feedbackForm.comments.trim() === '') {
        alert('Please provide key strengths');
        return;
      }
      if (!feedbackForm.interviewId && !feedbackForm.applicationId) {
        alert('Invalid interview or application');
        return;
      }

      // Remove id field before sending
      const { id, ...feedbackData } = feedbackForm as any;
      
      console.log('Submitting feedback:', feedbackData);
      const result = await feedbackAPI.create(feedbackData);
      console.log('Feedback created:', result);
      setShowFeedbackForm(false);
      
      // Reset form
      setFeedbackForm({
        interviewId: 0,
        applicationId: 0,
        providedByUserId: currentUser?.id || 1,
        technicalSkillsRating: 3,
        problemSolvingRating: 3,
        communicationRating: 3,
        culturalFitRating: 3,
        overallRating: 3,
        recommendation: 'Pending',
        comments: ''
      });
      
      loadData();
      alert('Feedback submitted successfully!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit feedback';
      console.error('Feedback error:', err.response?.data || err);
      alert(errorMsg);
    }
  };

  const handleDecision = async (applicationId: number, decision: string) => {
    if (window.confirm(`Are you sure you want to mark this application as ${decision}?`)) {
      try {
        await applicationAPI.updateDecision(applicationId, decision);
        loadData();
        alert(`Application ${decision} successfully!`);
      } catch (err) {
        alert('Failed to update decision');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'Applied': 'bg-gray-100 text-gray-800',
      'Screening': 'bg-blue-100 text-blue-800',
      'Interview': 'bg-purple-100 text-purple-800',
      'Offered': 'bg-green-100 text-green-800',
      'Selected': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'OnHold': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Check for completed interviews without feedback from current user
  const getCompletedInterviewsNeedingFeedback = () => {
    if (!details || !currentUser) return [];
    const needingFeedback: any[] = [];
    
    details.applications.forEach((app: any) => {
      app.interviews?.forEach((interview: any) => {
        if (interview.status === 'Completed') {
          // For panelists, show interviews where they are the interviewer
          if (isPanelist && interview.interviewerId !== currentUser.id) {
            return; // Skip interviews where panelist is not the interviewer
          }
          
          const userHasGivenFeedback = interview.feedbacks?.some(
            (f: any) => f.providedBy.id === currentUser?.id
          );
          if (!userHasGivenFeedback) {
            needingFeedback.push({ interview, application: app });
          }
        }
      });
    });
    
    return needingFeedback;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading candidate details...</div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Candidate not found'}
      </div>
    );
  }

  const completedInterviewsNeedingFeedback = getCompletedInterviewsNeedingFeedback();

  return (
    <div className="space-y-6">
      {/* Feedback Notification Banner */}
      {completedInterviewsNeedingFeedback.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-semibold">
                ⚠️ You have {completedInterviewsNeedingFeedback.length} completed interview(s) waiting for your feedback!
              </p>
              <div className="mt-2 text-sm text-yellow-700">
                {completedInterviewsNeedingFeedback.map(({ interview }, idx) => (
                  <p key={idx}>• Round {interview.round}: {interview.title}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <button
              onClick={() => navigate('/candidates')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
            >
              ← Back to Candidates
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{details.candidate.name}</h1>
            <div className="mt-2 space-y-1 text-gray-600">
              <p>📧 {details.candidate.email}</p>
              <p>📱 {details.candidate.phone}</p>
              <p>💼 {details.candidate.roleApplied}</p>
              {details.candidate.yearsOfExperience && (
                <p>📅 {details.candidate.yearsOfExperience} years of experience</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(details.candidate.status)}`}>
              {details.candidate.status || 'No Status'}
            </span>
          </div>
        </div>
      </div>

      {/* Applications */}
      {details.applications.map((application: any) => (
        <div key={application.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Application for {application.jobTitle}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
              {application.currentRound && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                  Round {application.currentRound}
                </span>
              )}
            </div>
          </div>

          {/* Decision Buttons for Hiring Manager */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => handleDecision(application.id, 'Selected')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              ✓ Select
            </button>
            <button
              onClick={() => handleDecision(application.id, 'Rejected')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              ✗ Reject
            </button>
            <button
              onClick={() => handleDecision(application.id, 'OnHold')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              ⏸ On Hold
            </button>
          </div>

          {/* Interview Rounds */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Interview Rounds</h3>
              {isManagerOrRecruiter && (
                <button
                  onClick={() => handleScheduleInterview(application)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  + Schedule Interview
                </button>
              )}
            </div>

            {application.interviews.length === 0 ? (
              <div className="bg-gray-50 rounded p-4 text-center text-gray-600">
                {isManagerOrRecruiter ? (
                  <>No interviews scheduled yet. Click "Schedule Interview" to add one.</>
                ) : (
                  <>No interviews assigned yet.</>
                )}
              </div>
            ) : (
              application.interviews.map((interview: any) => (
                <div key={interview.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {interview.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {interview.type} | {new Date(interview.scheduledDateTime).toLocaleString()}
                      </p>
                      {interview.interviewer && (
                        <p className="text-sm text-gray-600">
                          Interviewer: {interview.interviewer.name}
                        </p>
                      )}
                      {interview.meetingLink && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          🔗 Join Meeting
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                      {interview.status === 'Completed' && (
                        <button
                          onClick={() => handleAddFeedback(interview, application)}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                        >
                          + Add Feedback
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feedback for this interview */}
                  {interview.feedbacks && interview.feedbacks.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h5 className="font-semibold text-gray-700">Feedback:</h5>
                      {interview.feedbacks.map((feedback: any) => (
                        <div key={feedback.id} className="bg-white border rounded p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{feedback.providedBy.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(feedback.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              feedback.recommendation === 'StrongHire' || feedback.recommendation === 'Hire' 
                                ? 'bg-green-100 text-green-800'
                                : feedback.recommendation === 'NoHire'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {feedback.recommendation}
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-2 text-xs mb-2">
                            <div>
                              <p className="text-gray-600">Technical</p>
                              <p className={`font-semibold ${getRatingColor(feedback.technicalSkillsRating)}`}>
                                {feedback.technicalSkillsRating}/5
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Problem Solving</p>
                              <p className={`font-semibold ${getRatingColor(feedback.problemSolvingRating)}`}>
                                {feedback.problemSolvingRating}/5
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Communication</p>
                              <p className={`font-semibold ${getRatingColor(feedback.communicationRating)}`}>
                                {feedback.communicationRating}/5
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Culture Fit</p>
                              <p className={`font-semibold ${getRatingColor(feedback.culturalFitRating)}`}>
                                {feedback.culturalFitRating}/5
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Overall</p>
                              <p className={`font-semibold ${getRatingColor(feedback.overallRating)}`}>
                                {feedback.overallRating}/5
                              </p>
                            </div>
                          </div>
                          {feedback.comments && (
                            <div className="mb-2">
                              <p className="text-xs font-semibold text-green-700">Strengths:</p>
                              <p className="text-sm text-gray-700">{feedback.comments}</p>
                            </div>
                          )}
                          {feedback.comments && (
                            <div className="mb-2">
                              <p className="text-xs font-semibold text-orange-700">Concerns:</p>
                              <p className="text-sm text-gray-700">{feedback.comments}</p>
                            </div>
                          )}
                          {feedback.overallRating !== undefined && (
                            <div className="mb-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                feedback.overallRating 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {feedback.overallRating ? '✓ Proceed to Next Round' : '✗ Do Not Proceed'}
                              </span>
                            </div>
                          )}
                          {feedback.comments && (
                            <p className="text-sm text-gray-700">{feedback.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* General Feedback */}
          {application.generalFeedbacks && application.generalFeedbacks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">General Feedback</h3>
              <div className="space-y-2">
                {application.generalFeedbacks.map((feedback: any) => (
                  <div key={feedback.id} className="bg-gray-50 border rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{feedback.providedBy.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(feedback.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        feedback.recommendation === 'StrongHire' || feedback.recommendation === 'Hire' 
                          ? 'bg-green-100 text-green-800'
                          : feedback.recommendation === 'NoHire'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {feedback.recommendation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.comments}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Add Feedback for Round {selectedInterview?.round}
            </h3>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Rating Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role / Technical Competency (1-5)</label>
                  <select
                    value={feedbackForm.technicalSkillsRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, technicalSkillsRating: parseInt(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Problem Solving & Thinking (1-5)</label>
                  <select
                    value={feedbackForm.problemSolvingRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, problemSolvingRating: parseInt(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Communication & Clarity (1-5)</label>
                  <select
                    value={feedbackForm.communicationRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, communicationRating: parseInt(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Culture / Team Fit (1-5)</label>
                  <select
                    value={feedbackForm.culturalFitRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, culturalFitRating: parseInt(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Overall Interview Rating (1-5)</label>
                <select
                  value={feedbackForm.overallRating}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, overallRating: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Recommendation</label>
                <select
                  value={feedbackForm.recommendation}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, recommendation: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Select">Select</option>
                  <option value="Hold">Hold</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>

              {/* Key Qualitative Fields */}
              <div>
                <label className="block text-sm font-medium mb-1">Key Strengths (1-2 lines)</label>
                <textarea
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-16"
                  placeholder="What were the candidate's main strengths?"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Key Concerns / Gaps (1-2 lines)</label>
                <textarea
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-16"
                  placeholder="Any concerns or gaps identified?"
                  maxLength={500}
                />
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-sm font-medium mb-1">Additional Comments</label>
                <textarea
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Any additional notes or observations..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interview Scheduling Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Schedule Interview</h3>
            <form onSubmit={handleSubmitInterview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Interview Title</label>
                <input
                  type="text"
                  value={interviewForm.title}
                  onChange={(e) => setInterviewForm({ ...interviewForm, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Interview Type</label>
                  <select
                    value={interviewForm.type}
                    onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={interviewForm.durationMinutes}
                    onChange={(e) => setInterviewForm({ ...interviewForm, durationMinutes: parseInt(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                    min="15"
                    step="15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewForm.scheduledDateTime}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDateTime: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Platform (optional)</label>
                <select
                  value={interviewForm.meetingLink?.includes('teams.microsoft.com') ? 'teams' : 
                         interviewForm.meetingLink?.includes('zoom.us') ? 'zoom' : 'custom'}
                  onChange={(e) => {
                    const platform = e.target.value;
                    if (platform === 'teams') {
                      setInterviewForm({ ...interviewForm, meetingLink: 'https://teams.microsoft.com/l/meetup-join/' });
                    } else if (platform === 'zoom') {
                      setInterviewForm({ ...interviewForm, meetingLink: 'https://zoom.us/j/' });
                    } else {
                      setInterviewForm({ ...interviewForm, meetingLink: '' });
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- No Meeting Link --</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="zoom">Zoom</option>
                  <option value="custom">Custom Link</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meeting Link {interviewForm.meetingLink ? '' : '(optional)'}
                </label>
                <input
                  type="url"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Paste your Teams or Zoom meeting link here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Teams: https://teams.microsoft.com/l/meetup-join/...<br />
                  Zoom: https://zoom.us/j/...
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location (optional)</label>
                <input
                  type="text"
                  value={interviewForm.location}
                  onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Conference Room A or leave blank for online"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Any special instructions or topics to cover..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
