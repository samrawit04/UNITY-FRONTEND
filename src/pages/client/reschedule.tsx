
import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  addMonths,
  subMonths,
  startOfToday,
  parse,
} from "date-fns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Declare confetti as a global variable
declare global {
  interface Window {
    confetti: (options?: {
      particleCount?: number;
      spread?: number;
      origin?: { y: number };
      colors?: string[];
    }) => void;
  }
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

interface Counselor {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  image?: string;
}

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  zoomJoinUrl?: string;
  counselor: Counselor;
}

const API_URL = "http://localhost:3000";

const SelectTimeSlot: React.FC = () => {
  const location = useLocation();
  const { session, availability, clientId } = location.state || {};
  const navigate = useNavigate();
  const params = useParams<{ yearMonth?: string }>();

  const [currentStep] = useState(2);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const initialMonth = params.yearMonth
    ? parse(params.yearMonth, "yyyy-MM", new Date())
    : new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(initialMonth)
  );
  const today = startOfToday();
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Debug state
  useEffect(() => {
    console.log("SelectTimeSlot state:", { session, availability, clientId });
  }, [session, availability, clientId]);

  // Map availability to schedule
  useEffect(() => {
    if (!availability?.dates) return;
    const newSchedule: DaySchedule[] = availability.dates.map(({ date, times }) => ({
      date,
      slots: times.map(({ id, startTime, endTime }) => ({
        id,
        start: startTime,
        end: endTime,
      })),
    }));
    setSchedule(newSchedule);
  }, [availability]);

  // Trigger confetti on success
  useEffect(() => {
    if (success && window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4b2a75", "#7c3aed", "#d8b4fe"],
      });
    }
  }, [success]);

  const getDateSchedule = (date: Date): TimeSlot[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    const daySchedule = schedule.find((s) => s.date === dateStr);
    return daySchedule?.slots || [];
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleRebook = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }
    if (!session?.id) {
      setError("Missing session ID.");
      return;
    }
    if (!clientId) {
      setError("Missing client ID.");
      return;
    }

    console.log("Rebooking with:", { oldBookingId: session.id, newScheduleId: selectedSlot.id, clientId });

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`${API_URL}/api/rebook`, {
        oldBookingId: session.id,
        newScheduleId: selectedSlot.id,
        clientId,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to rebook. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!session || !availability || !clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-poppins">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#4b2a75] mb-4">
            Error: Missing Session Data
          </h2>
          <p className="text-gray-600 mb-6">
            Please return to the dashboard and try again.
          </p>
          <button
            onClick={() => navigate("/client-dashboard")}
            className="bg-[#4b2a75] text-white px-6 py-2 rounded-full hover:bg-[#3a2057] transition transform hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const counselor = session.counselor;
  const fullName = `${counselor.firstName} ${counselor.lastName}`.trim();
  const firstLetter = counselor.firstName?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 flex items-center justify-center font-poppins relative overflow-hidden">
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-4xl w-full mx-4">
        <h2 className="text-3xl font-extrabold text-[#4b2a75] mb-6 text-center animate-fade-in">
          Reschedule Your Session
        </h2>

        {/* Counselor Info Card */}
        <div className="mb-8 bg-gradient-to-r from-[#f5f0ff] to-[#e0d6ff] rounded-2xl p-6 shadow-md border border-[#4b2a75]/20 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Your Counselor
          </h3>
          <div className="flex items-center space-x-4">
            {counselor.image ? (
              <img
                src={`${API_URL}/Uploads/profile-pictures/${counselor.image}`}
                alt={fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#4b2a75]/30"
                onError={(e) => (e.currentTarget.src = "/path/to/images/default-avatar.jpg")}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#4b2a75] flex items-center justify-center text-white text-xl font-bold">
                {firstLetter}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-[#4b2a75]">{fullName}</h4>
              <p className="text-gray-600">{counselor.specialization || "Counselor"}</p>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        {/* Success Card */}
        {success && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center animate-pop-in max-w-sm w-full">
              <h3 className="text-2xl font-bold text-[#4b2a75] mb-4">
                Session Rescheduled Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your session with {fullName} has been updated.
              </p>
              <button
                onClick={() => navigate("/client-dashboard")}
                className="bg-[#4b2a75] text-white px-6 py-2 rounded-full hover:bg-[#3a2057] transition transform hover:scale-105"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Calendar and Booking Panel */}
        {!success && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Panel */}
            <div className="rounded-2xl bg-white/50 backdrop-blur-md p-6 shadow-lg border border-white/30 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold text-[#4b2a75]">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-[#4b2a75]/10 rounded-full transition"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-[#4b2a75]/10 rounded-full transition"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-[#4b2a75]/10 text-center text-xs font-semibold rounded-t-lg">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                  <div key={day} className="bg-white/70 py-2 text-[#4b2a75]">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-[#4b2a75]/10 rounded-b-lg">
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const hasSlots = schedule.some((s) => s.date === dateStr);
                  const isPastDate = isBefore(day, today);
                  const isDisabled = isPastDate || !hasSlots;

                  return (
                    <button
                      key={day.toString()}
                      onClick={() => !isDisabled && handleDateClick(day)}
                      disabled={isDisabled}
                      className={`bg-white/70 py-4 text-center relative hover:bg-[#4b2a75]/5 transition
                        ${!isSameMonth(day, currentMonth) && "text-gray-400"}
                        ${isToday(day) && "font-bold text-[#4b2a75]"}
                        ${
                          selectedDate && isSameDay(day, selectedDate)
                            ? "bg-[#4b2a75]/10 border border-[#4b2a75]/30"
                            : ""
                        }
                        ${
                          isDisabled
                            ? "cursor-not-allowed bg-gray-100/50 text-gray-400"
                            : "hover:scale-105"
                        }`}
                    >
                      {format(day, "d")}
                      {hasSlots && !isPastDate && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking Panel */}
            {selectedDate && (
              <div className="rounded-2xl bg-white/50 backdrop-blur-md p-6 shadow-lg border border-white/30 animate-slide-up">
                <h2 className="text-lg font-semibold text-[#4b2a75] mb-4">
                  {format(selectedDate, "EEE MMM dd yyyy")} GMT+0300
                </h2>
                <div>
                  <h3 className="font-medium text-gray-700 mb-4">Available Time Slots</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {getDateSchedule(selectedDate).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`relative flex items-center justify-between px-4 py-3 rounded-lg border border-transparent bg-white/70 hover:bg-white/90 transition transform hover:scale-105
                          ${
                            selectedSlot?.id === slot.id
                              ? "bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white shadow-md"
                              : "text-[#4b2a75] hover:border-[#4b2a75]/30"
                          }`}
                      >
                        {slot.start} - {slot.end}
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] opacity-0 hover:opacity-10 transition"></span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {!success && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => navigate("/client-dashboard")}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition transform hover:scale-105"
            >
              Back
            </button>
            <button
              onClick={handleRebook}
              disabled={!!loading}
              className="bg-[#4b2a75] text-white px-6 py-2 rounded-full shadow-lg3 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700]"
            >
              {loading ? "Processing..." : "Reschedule"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-in-out;
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.5s ease-in-out;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
        .particle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M20.84 4.61a5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E") no-repeat center;
          background-size: contain;
          animation: particle-float 12s infinite linear;
        }
        .particle-1 {
          color: #4b2a75;
          top: 10%;
          left: 20%;
          animation-delay: 0s;
          transform: scale(0.8);
        }
        .particle.-2 {
          color: #7c3aed;
          top: 40%;
          left: #70%;
          animation-delay::3s;
          transform: 1 scale;
        }
        .particle .3 {
          color: #d8b4fe;
          top: 60%;
          left: 30%;
          animation-delay:: 6s;
          transform: scale(0.6);
        }
        .particle-4 {
          color: #a78bfa;
          top: 80%;
          left: 50%;
          animation-delay: :9s;
          transform: scale(1.2);
        }
        @keyframes particle-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-80vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SelectTimeSlot;
