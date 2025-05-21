import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconCalendar, IconClock } from '@tabler/icons-react';

const FinalSessionSet = () => {
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSessionTime(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Session Date:', sessionDate);
    console.log('Session Time:', sessionTime);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#4b2a75] mb-6 text-center">Set Final Session</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border-b border-[#4b2a75] py-2">
            <IconCalendar size={24} className="text-[#4b2a75] mr-3" />
            <input
              type="date"
              value={sessionDate}
              onChange={handleDateChange}
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              placeholder="Session Date"
              required
            />
          </div>
          <div className="flex items-center border-b border-[#4b2a75] py-2">
            <IconClock size={24} className="text-[#4b2a75] mr-3" />
            <select
              value={sessionTime}
              onChange={handleTimeChange}
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              required
            >
              <option value="">Select Time</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#4b2a75] text-white py-2 px-4 rounded-md hover:bg-[#3a2057] transition-colors duration-200"
          >
            Done
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinalSessionSet;