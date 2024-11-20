import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/registrations/my-registrations');
        setRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
        toast.error('Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleCancel = async (registrationId) => {
    try {
      await axios.put(`http://localhost:3000/api/registrations/${registrationId}/cancel`);
      setRegistrations(registrations.map(reg => 
        reg._id === registrationId ? { ...reg, status: 'cancelled' } : reg
      ));
      toast.success('Registration cancelled successfully');
    } catch (error) {
      console.error('Error cancelling registration:', error);
      toast.error('Failed to cancel registration');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Registrations</h1>
      <div className="space-y-4">
        {registrations.map((registration) => (
          <div
            key={registration._id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {registration.event?.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  {new Date(registration.event?.date).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Status: <span className="font-medium">{registration.status}</span>
                </p>
              </div>
              {registration.status === 'pending' && (
                <button
                  onClick={() => handleCancel(registration._id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Registration
                </button>
              )}
            </div>
          </div>
        ))}
        {registrations.length === 0 && (
          <p className="text-center text-gray-600">
            You haven't registered for any events yet.
          </p>
        )}
      </div>
    </div>
  );
}