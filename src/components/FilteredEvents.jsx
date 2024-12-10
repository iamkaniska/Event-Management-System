import React, { useState } from 'react';
import axios from 'axios';
import DateFilterForm from './DateFilterForm';
import EventTable from './EventTable';
import toast from 'react-hot-toast';

export default function FilteredEvents() {
  const [events, setEvents] = useState([]);

  const fetchFilteredEvents = async (startDate, endDate) => {
    try {
      const response = await axios.get('http://localhost:3000/api/events/byDate', {
        params: { startDate, endDate },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching filtered events:', error);
      toast.error('Failed to fetch events');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Filter Events by Date</h1>
      <DateFilterForm onFilter={fetchFilteredEvents} />
      <EventTable events={events} />
    </div>
  );
}
