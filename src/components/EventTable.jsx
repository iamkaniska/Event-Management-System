import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EventTable({ events }) {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 1; // Number of events to display per page

  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Calculate the events to display for the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleDownloadAllPDF = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/events/download-pdf', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `all_events.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading all events PDF:', error);
      toast.error('Failed to download all events PDF');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (events.length === 0) {
    return <div className="text-center text-gray-500">No events found</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="mb-4 text-right">
        <button
          onClick={handleDownloadAllPDF}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Download All Events as PDF
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Capacity</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event) => (
            <tr key={event._id}>
              <td className="border border-gray-300 px-4 py-2">{event.title}</td>
              <td className="border border-gray-300 px-4 py-2">{event.description}</td>
              <td className="border border-gray-300 px-4 py-2">{event.capacity}</td>
              <td className="border border-gray-300 px-4 py-2">${event.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
