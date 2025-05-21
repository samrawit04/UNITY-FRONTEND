import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconClock, IconPlus, IconUser } from '@tabler/icons-react';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

const CounselorSchedule = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const addTimeSlot = () => {
    const newSlot = {
      id: Date.now().toString(),
      day: selectedDay,
      startTime: '09:00',
      endTime: '10:00'
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  const updateTimeSlot = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

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
            <Link to="/" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Client
            </Link>
            <Link to="/counselor-posts" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Posts
            </Link>
            <Link to="/logout" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">Logout</Link>
            <Link to="/profile" className="text-[#4b2a75] hover:text-[#3a2057]">
              <IconUser size={24} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <h1 className="text-3xl font-semibold text-[#4b2a75] mb-8">Manage Your Schedule</h1>

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
          <h2 className="text-xl font-semibold text-[#4b2a75] mb-4">Available Time Slots for {selectedDay}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {timeSlots
              .filter(slot => slot.day === selectedDay)
              .map(slot => (
                <div key={slot.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <IconClock size={20} className="text-[#4b2a75]" />
                      <select
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2a75]"
                      >
                        {timeOptions.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock size={20} className="text-[#4b2a75]" />
                      <select
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2a75]"
                      >
                        {timeOptions.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeTimeSlot(slot.id)}
                      className="w-full py-2 px-4 bg-[#e9deff] text-[#4b2a75] rounded hover:bg-[#d8c5ff] transition-colors"
                    >
                      Remove Slot
                    </button>
                  </div>
                </div>
              ))}
            
            {/* Add Time Slot Button */}
            <button
              onClick={addTimeSlot}
              className="h-48 flex items-center justify-center rounded-lg border-2 border-dashed border-[#4b2a75] hover:bg-[#f5f0ff] transition-colors"
            >
              <IconPlus size={32} className="text-[#4b2a75]" />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mb-8">
          <button className="bg-[#4b2a75] text-white px-6 py-2 rounded-lg hover:bg-[#3a2057] transition-colors">
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounselorSchedule;