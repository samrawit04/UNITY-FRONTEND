import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconPlus, IconClock, IconCalendar, IconUser } from '@tabler/icons-react';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

const CounselorAvailability = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Mock available time slots
  const availableTimeSlots = [
    { id: '1', time: '09:00 - 10:00' },
    { id: '2', time: '10:00 - 11:00' },
    { id: '3', time: '11:00 - 12:00' },
    { id: '4', time: '14:00 - 15:00' },
    { id: '5', time: '15:00 - 16:00' },
    { id: '6', time: '16:00 - 17:00' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/src/asset/logo.png" alt="Unity Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Home
            </Link>
            <Link to="/counselor-posts" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Counselor Posts
            </Link>
            <Link to="/logout" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">Logout</Link>
            <Link to="/profile" className="text-[#4b2a75] hover:text-[#3a2057]">
              <IconUser size={24} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <h1 className="text-3xl font-semibold text-[#4b2a75] mb-8">Available Time Slots</h1>

        {/* Day Selection */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedDay === day
                ? 'bg-[#4b2a75] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#4b2a75] mb-4">Select a Time Slot for {selectedDay}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableTimeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot.id)}
                className={`p-4 rounded-lg text-center transition-colors ${selectedTimeSlot === slot.id
                  ? 'bg-[#4b2a75] text-white'
                  : 'bg-white hover:bg-[#f5f0ff] text-[#4b2a75]'}`}
              >
                <IconClock size={24} className={`mx-auto mb-2 ${selectedTimeSlot === slot.id ? 'text-white' : 'text-[#4b2a75]'}`} />
                <span className="block font-medium">{slot.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end mb-8">
          <button 
            disabled={!selectedTimeSlot}
            className={`px-6 py-2 rounded-lg transition-colors ${selectedTimeSlot
              ? 'bg-[#4b2a75] text-white hover:bg-[#3a2057]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounselorAvailability;