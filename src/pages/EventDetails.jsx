import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/api/registrations', {
        eventId: id,
      });
      toast.success('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events/download-pdf/${id}`, {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center">Event not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Download PDF
        </button>
      </div>
      <div className="mb-6">
        <p className="text-gray-600">{event.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold">Date & Time</h3>
          <p>{new Date(event.date).toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location</h3>
          <p>{event.location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Capacity</h3>
          <p>{event.capacity} people</p>
        </div>
        <div>
          <h3 className="font-semibold">Price</h3>
          <p>${event.price}</p>
        </div>
      </div>
      {user && (
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register for Event
        </button>
      )}
    </div>
  );
}
