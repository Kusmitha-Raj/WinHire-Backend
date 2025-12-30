import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { candidateAPI } from '../api/candidateApi';
import { userAPI } from '../api/userApi';
import { jobAPI } from '../api/jobApi';
import { availabilityAPI } from '../api/availabilityApi';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [candidateDetails, setCandidateDetails] = useState<any>(null);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', phone: '', roleApplied: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Recruiter', password: '' });
  const [newJob, setNewJob] = useState({ title: '', description: '', department: '', location: '', requiredSkills: '', status: 'Open' });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobAPI.getAll();
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  const loadData = async () => {
    try {
      if (activeTab === 'candidates') {
        const data = await candidateAPI.getAll();
        setCandidates(data || []);
      } else if (activeTab === 'users') {
        const data = await userAPI.getAll();
        setUsers(data || []);
      } else if (activeTab === 'jobs') {
        const data = await jobAPI.getAll();
        setJobs(data || []);
      } else if (activeTab === 'availability') {
        const data = await availabilityAPI.getAll();
        setAvailability(data || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await candidateAPI.create(newCandidate);
      setNewCandidate({ name: '', email: '', phone: '', roleApplied: '' });
      setShowAddCandidate(false);
      loadData();
      alert('Candidate added successfully!');
    } catch (err) {
      alert('Failed to add candidate');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.create(newUser);
      setNewUser({ name: '', email: '', role: 'Recruiter', password: '' });
      setShowAddUser(false);
      loadData();
      alert('User added successfully!');
    } catch (err) {
      alert('Failed to add user');
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await jobAPI.create(newJob);
      setNewJob({ title: '', description: '', department: '', location: '', requiredSkills: '', status: 'Open' });
      setShowAddJob(false);
      loadData();
      alert('Job added successfully!');
    } catch (err) {
      alert('Failed to add job');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        loadData();
        alert('User deleted successfully!');
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.delete(id);
        loadData();
        alert('Job deleted successfully!');
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  const handleViewCandidateDetails = async (candidate: any) => {
    try {
      console.log('Fetching details for candidate:', candidate.id);
      const details = await candidateAPI.getDetails(candidate.id);
      console.log('Received details:', details);
      
      // Handle both capital and lowercase property names
      const normalizedDetails = {
        candidate: details.candidate || details.Candidate,
        applications: details.applications || details.Applications || []
      };
      
      console.log('Normalized details:', normalizedDetails);
      setCandidateDetails(normalizedDetails);
      setSelectedCandidate(candidate);
    } catch (err) {
      console.error('Error loading candidate details:', err);
      alert('Failed to load candidate details: ' + (err as any).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['candidates', 'users', 'jobs', 'availability'].map((tab) => (
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

          {/* Content */}
          <div className="p-6">
            {/* CANDIDATES TAB */}
            {activeTab === 'candidates' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Candidates Management</h2>
                  <button
                    onClick={() => setShowAddCandidate(!showAddCandidate)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {showAddCandidate ? 'Cancel' : '+ Add Candidate'}
                  </button>
                </div>

                {showAddCandidate && (
                  <form onSubmit={handleAddCandidate} className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={newCandidate.email}
                        onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        required
                        value={newCandidate.phone}
                        onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <select
                        required
                        value={newCandidate.roleApplied}
                        onChange={(e) => setNewCandidate({ ...newCandidate, roleApplied: e.target.value })}
                        className="border rounded px-3 py-2"
                      >
                        <option value="">Select Job Role</option>
                        {jobs.filter(job => job.status === 'Open').map((job) => (
                          <option key={job.id} value={job.title}>
                            {job.title} - {job.department}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                      Add Candidate
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {candidates.map((candidate) => (
                        <tr key={candidate.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{candidate.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{candidate.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{candidate.roleApplied}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {candidate.status || 'New'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewCandidateDetails(candidate)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {candidates.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No candidates found. Add your first candidate!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Candidate Details Modal */}
                {selectedCandidate && candidateDetails && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold">{selectedCandidate.name} - Details</h2>
                          <button
                            onClick={() => { setSelectedCandidate(null); setCandidateDetails(null); }}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                          >
                            ×
                          </button>
                        </div>

                        {/* Candidate Info */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-bold mb-2">Candidate Information</h3>
                          <p><strong>Email:</strong> {selectedCandidate.email}</p>
                          <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
                          <p><strong>Role Applied:</strong> {selectedCandidate.roleApplied}</p>
                          <p><strong>Status:</strong> {selectedCandidate.status || 'New'}</p>
                        </div>

                        {/* Interviews & Feedback */}
                        <div>
                          <h3 className="font-bold text-xl mb-4">Applications & Interviews</h3>
                          {candidateDetails.applications && candidateDetails.applications.length > 0 ? (
                            candidateDetails.applications.map((application: any) => (
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
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">User Management</h2>
                  <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {showAddUser ? 'Cancel' : '+ Add User'}
                  </button>
                </div>

                {showAddUser && (
                  <form onSubmit={handleAddUser} className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="border rounded px-3 py-2"
                      >
                        <option value="Recruiter">Recruiter</option>
                        <option value="Panelist">Panelist</option>
                        <option value="HiringManager">Hiring Manager</option>
                      </select>
                    </div>
                    <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                      Add User
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {u.role !== 'Admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            No users found. Add your first user!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* JOBS TAB */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Job Postings</h2>
                  <button
                    onClick={() => setShowAddJob(!showAddJob)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {showAddJob ? 'Cancel' : '+ Add Job'}
                  </button>
                </div>

                {showAddJob && (
                  <form onSubmit={handleAddJob} className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Job Title"
                        required
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Department"
                        required
                        value={newJob.department}
                        onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        required
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        className="border rounded px-3 py-2"
                      />
                      <select
                        value={newJob.status}
                        onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                        className="border rounded px-3 py-2"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <textarea
                        placeholder="Description"
                        required
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        className="border rounded px-3 py-2 col-span-2"
                        rows={3}
                      />
                      <textarea
                        placeholder="Required Skills"
                        required
                        value={newJob.requiredSkills}
                        onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                        className="border rounded px-3 py-2 col-span-2"
                        rows={2}
                      />
                    </div>
                    <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                      Add Job
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 bg-white shadow relative">
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                      <h3 className="text-lg font-bold pr-16">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                      <p className="mt-2 text-sm">{job.description}</p>
                      <p className="mt-2 text-sm text-gray-500"><strong>Required Skills:</strong> {job.requiredSkills}</p>
                      <p className="mt-1 text-xs"><span className={`px-2 py-1 rounded ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{job.status}</span></p>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                      No jobs posted yet. Add your first job posting!
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'availability' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Panelist Availability</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Panelist</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availability.map((avail: any) => (
                        <tr key={avail.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{avail.panelist?.name || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(avail.availableDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{avail.startTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{avail.endTime}</td>
                        </tr>
                      ))}
                      {availability.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            No availability records found.
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
    </div>
  );
}
