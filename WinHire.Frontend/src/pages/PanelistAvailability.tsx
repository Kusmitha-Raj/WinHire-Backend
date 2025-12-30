import React, { useState, useEffect } from 'react';
import { availabilityAPI, type PanelistAvailability } from '../api/availabilityApi';
import { userAPI } from '../api/userApi';

const PanelistAvailabilityPage: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<PanelistAvailability[]>([]);
  const [panelists, setPanelists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{"id": 1, "role": "Admin"}'));
  
  const [formData, setFormData] = useState<PanelistAvailability>({
    panelistId: currentUser?.id || 1,
    availableDate: '',
    startTime: '09:00',
    endTime: '17:00',
    status: 'Available',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [avails, panelistList] = await Promise.all([
        availabilityAPI.getAll(),
        userAPI.getPanelists()
      ]);
      setAvailabilities(avails);
      setPanelists(panelistList);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.availableDate || !formData.startTime || !formData.endTime) {
        alert('Please fill in all required fields');
        return;
      }

      const convertToTimeSpan = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
      };

      const { id, ...dataToSend } = formData as any;
      const payload = {
        ...dataToSend,
        availableDate: formData.availableDate,
        startTime: convertToTimeSpan(formData.startTime),
        endTime: convertToTimeSpan(formData.endTime)
      };

      await availabilityAPI.create(payload);
      setShowForm(false);
      setFormData({
        panelistId: currentUser?.id || 1,
        availableDate: '',
        startTime: '09:00',
        endTime: '17:00',
        status: 'Available',
        notes: ''
      });
      loadData();
      alert('Availability added successfully!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add availability';
      alert(errorMsg);
      console.error('Availability submission error:', err.response?.data || err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await availabilityAPI.delete(id);
        loadData();
      } catch (err) {
        alert('Failed to delete availability');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Booked':
        return 'bg-blue-100 text-blue-800';
      case 'Unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading availabilities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Panelist Availability</h1>
        {currentUser?.role === 'Panelist' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showForm ? '✕ Cancel' : '+ Add Availability'}
          </button>
        )}
      </div>

      {showForm && currentUser?.role === 'Panelist' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Add Your Availability</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.availableDate}
                  onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border rounded px-3 py-2 h-20"
                placeholder="Any special notes about your availability..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save Availability
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">All Panelist Availabilities</h2>
        
        {availabilities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No availabilities found. Add your availability to help with interview scheduling.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(
              availabilities.reduce((acc, avail) => {
                const date = new Date(avail.availableDate).toLocaleDateString();
                if (!acc[date]) acc[date] = [];
                acc[date].push(avail);
                return acc;
              }, {} as Record<string, PanelistAvailability[]>)
            ).map(([date, dateAvails]) => (
              <div key={date} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">📅 {date}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dateAvails.map((avail) => (
                    <div key={avail.id} className="border rounded p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{avail.panelist?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{avail.panelist?.department || 'N/A'}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(avail.status)}`}>
                          {avail.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        🕐 {avail.startTime} - {avail.endTime}
                      </p>
                      {avail.notes && (
                        <p className="text-xs text-gray-600 mt-2">📝 {avail.notes}</p>
                      )}
                      {currentUser?.role === 'Panelist' && currentUser?.id === avail.panelistId && (
                        <button
                          onClick={() => avail.id && handleDelete(avail.id)}
                          className="mt-2 text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Panelist Summary</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {panelists.map((panelist) => {
            const panelistAvails = availabilities.filter(a => a.panelistId === panelist.id);
            const availableCount = panelistAvails.filter(a => a.status === 'Available').length;
            return (
              <div key={panelist.id} className="border rounded p-4">
                <p className="font-medium">{panelist.name}</p>
                <p className="text-sm text-gray-600">{panelist.department || 'N/A'}</p>
                <div className="mt-2 text-sm">
                  <span className="text-green-600 font-semibold">{availableCount}</span> available slots
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PanelistAvailabilityPage;
