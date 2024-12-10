import React, { useState } from 'react';

export default function DateFilterForm({ onFilter }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    onFilter(startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white shadow rounded">
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
  );
}
