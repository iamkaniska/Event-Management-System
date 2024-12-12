import React, { useState } from 'react';

export default function DateFilterForm({ onFilter, onPageChange, totalPages }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    onFilter(startDate, endDate);
    setCurrentPage(1); // Reset to the first page on filter
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  return (
    <div className="mb-4 p-4 bg-white shadow rounded">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-bold mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-bold mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Filter
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
