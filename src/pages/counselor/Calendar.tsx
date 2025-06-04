
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./component/Navbar";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfToday,
  addHours,
  parse,
} from "date-fns";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

interface TimeSlot {
  id?: string;
  start: string;
  end: string;
}

interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [newSlot, setNewSlot] = useState<TimeSlot>({ start: "", end: "" });
  const [counselorId, setCounselorId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const today = startOfToday();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Fetch profile with status and approval
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const decoded = parseJwt(token);
      const id = decoded?.id || decoded?.userId || null;
      setCounselorId(id);

      if (!id) {
        setLoadingProfile(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/counselors/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStatus(res.data.status);
        setIsApproved(res.data.isApproved);
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Normalize approval and status for logic
  const approved = isApproved === true;
  const activeStatus = status?.toLowerCase() === "active";
  const canModifyAvailability = activeStatus && approved;

  // Fetch schedule when currentMonth or counselorId changes
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!counselorId) return;

      const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");

      try {
        const res = await axios.get(`http://localhost:3000/schedule/available`, {
          params: { startDate, endDate, counselorId },
        });

        const scheduleMap: Record<string, TimeSlot[]> = {};
        res.data.forEach((slot: any) => {
          const dateStr = slot.date.split("T")[0];
          if (!scheduleMap[dateStr]) scheduleMap[dateStr] = [];
          scheduleMap[dateStr].push({
            id: slot.id,
            start: slot.startTime,
            end: slot.endTime,
          });
        });

        const newSchedule: DaySchedule[] = Object.entries(scheduleMap).map(
          ([date, slots]) => ({
            date,
            slots,
          }),
        );

        setSchedule(newSchedule);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      }
    };

    fetchSchedule();
  }, [currentMonth, counselorId]);

  // Auto update end time +1 hour when start time changes
  const handleStartTimeChange = (startTime: string) => {
    setNewSlot((prev) => {
      if (!startTime) {
        return { start: "", end: "" };
      }

      const parsedTime = parse(startTime, "HH:mm", new Date());
      const endTimeDate = addHours(parsedTime, 1);
      const endTime = format(endTimeDate, "HH:mm");
      return { start: startTime, end: endTime };
    });
  };

  const handleAddSlot = async () => {
    if (!selectedDate || !newSlot.start || !newSlot.end) return;
    if (!canModifyAvailability) {
      alert(
        "Your account is not active or approved. You cannot post articles or set availabilities.",
      );
      return;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");

    try {
      const res = await axios.post(`http://localhost:3000/schedule`, {
        date: dateStr,
        startTime: newSlot.start,
        endTime: newSlot.end,
        counselorId,
        isAvailable: true,
      });

      const newEntry: TimeSlot = {
        id: res.data.id,
        start: res.data.startTime,
        end: res.data.endTime,
      };

      setSchedule((prev) => {
        const existing = prev.find((s) => s.date === dateStr);
        if (existing) {
          return prev.map((s) =>
            s.date === dateStr ? { ...s, slots: [...s.slots, newEntry] } : s,
          );
        }
        return [...prev, { date: dateStr, slots: [newEntry] }];
      });

      setNewSlot({ start: "", end: "" });
    } catch (err) {
      console.error("Failed to add slot", err);
    }
  };

  const handleRemoveSlot = async (date: Date, slot: TimeSlot) => {
    if (!slot.id) return;
    if (!canModifyAvailability) {
      alert(
        "Your account is not active or approved. You cannot post articles or set availabilities.",
      );
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/schedule/${slot.id}`);
      const dateStr = format(date, "yyyy-MM-dd");

      setSchedule((prev) =>
        prev.map((s) =>
          s.date === dateStr
            ? { ...s, slots: s.slots.filter((t) => t.id !== slot.id) }
            : s,
        ),
      );
    } catch (err) {
      console.error("Failed to delete slot", err);
    }
  };

  const getDateSchedule = (date: Date): TimeSlot[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    const daySchedule = schedule.find((s) => s.date === dateStr);
    return daySchedule?.slots || [];
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) {
      return;
    }
    setSelectedDate(date);
  };

  if (loadingProfile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 flex items-center justify-center">
          <div className="text-[#4b2a75] text-xl animate-pulse">Loading profile...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 font-poppins relative overflow-hidden p-6 sm:p-8 lg:p-12">
        {/* Heart Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4b2a75] mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] animate-slide-up">
          Your Availability Calendar
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Calendar */}
          <div className="w-full lg:w-96 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border-2 border-[#4b2a75]/10 animate-slide-up">
            <div className="flex items-center justify-between border-b border-[#4b2a75]/20 px-6 py-4">
              <span className="text-xl font-semibold text-[#4b2a75]">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1),
                    )
                  }
                  className="p-2 hover:bg-[#f5f0ff] rounded-full transition"
                >
                  <svg className="w-5 h-5 text-[#4b2a75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1),
                    )
                  }
                  className="p-2 hover:bg-[#f5f0ff] rounded-full transition"
                >
                  <svg className="w-5 h-5 text-[#4b2a75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#4b2a75]/10 text-center text-xs font-semibold text-[#4b2a75] uppercase">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <div key={day} className="bg-white/90 py-3">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#4b2a75]/10">
              {days.map((day) => {
                const hasSlots = getDateSchedule(day).length > 0;
                const isPastDate = isBefore(day, today);
                return (
                  <button
                    key={day.toString()}
                    onClick={() => !isPastDate && handleDateClick(day)}
                    disabled={isPastDate}
                    className={`
                      bg-white/90 py-4 text-center relative transition-all
                      ${!isSameMonth(day, currentMonth) ? "text-gray-400" : "text-gray-800"}
                      ${isToday(day) ? "font-bold text-[#4b2a75]" : ""}
                      ${
                        selectedDate && isSameDay(day, selectedDate)
                          ? "bg-gradient-to-br from-[#4b2a75]/20 to-[#7c3aed]/20"
                          : isPastDate
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "hover:bg-[#f5f0ff]"
                      }
                    `}
                  >
                    {format(day, "d")}
                    {hasSlots && !isPastDate && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <div className="w-2 h-2 bg-[#34d399] rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule Panel */}
          {selectedDate && (
            <div className="flex-1 rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-xl border-2 border-[#4b2a75]/10 animate-slide-up">
              <h2 className="text-2xl font-semibold text-[#4b2a75] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed]">
                {format(selectedDate, "EEEE, MMMM dd, yyyy")}
              </h2>

              {!canModifyAvailability && (
                <div className="bg-red-100/50 rounded-lg p-4 mb-6 text-center border border-red-200">
                  <p className="text-red-600 text-lg">
                    Your account is not active or approved. You cannot set availabilities.
                  </p>
                </div>
              )}

              <div className="space-y-8">
                {/* Add New Time Slot */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#4b2a75]/10">
                  <h3 className="font-semibold text-[#4b2a75] mb-4">Add New Time Slot</h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="w-full sm:w-1/3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newSlot.start}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        className="w-full border border-[#4b2a75]/30 p-3 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#4b2a75] focus:border-transparent transition text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={!canModifyAvailability}
                      />
                    </div>
                    <div className="w-full sm:w-1/3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={newSlot.end}
                        readOnly
                        className="w-full border border-[#4b2a75]/30 p-3 rounded-lg bg-gray-100 cursor-not-allowed text-gray-800"
                      />
                    </div>
                    <button
                      onClick={handleAddSlot}
                      disabled={
                        !canModifyAvailability || !newSlot.start || !newSlot.end
                      }
                      className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105 ${
                        canModifyAvailability && newSlot.start && newSlot.end
                          ? "bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white hover:from-[#3a2057] hover:to-[#6d28d9] shadow-md"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      Add Slot
                    </button>
                  </div>
                </div>

                {/* Available Time Slots */}
                <div>
                  <h3 className="font-semibold text-[#4b2a75] mb-4">Available Time Slots</h3>
                  {getDateSchedule(selectedDate).length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-[#4b2a75]/10">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto mb-4 animate-draw-path"
                      >
                        <path
                          d="M100 150 C80 150, 60 130, 60 100 C60 70, 80 50, 100 50 C120 50, 140 70, 140 100 C140 130, 120 150, 100 150"
                          stroke="#4b2a75"
                          strokeWidth="8"
                          fill="none"
                          className="heart-path"
                        />
                        <path
                          d="M90 100 L100 110 L110 100"
                          stroke="#7c3aed"
                          strokeWidth="6"
                          fill="none"
                          className="heart-path"
                        />
                      </svg>
                      <p className="text-[#4b2a75] text-lg">
                        No time slots available for this date.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getDateSchedule(selectedDate).map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border-2 border-[#4b2a75]/10 hover:border-[#4b2a75]/20 transition-transform transform hover:scale-[1.02]"
                        >
                          <span className="text-gray-800 font-medium">
                            {slot.start} - {slot.end}
                          </span>
                          {canModifyAvailability && (
                            <button
                              onClick={() => handleRemoveSlot(selectedDate, slot)}
                              className="text-red-600 hover:text-red-700 transition"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.7s ease-out;
          }
          @keyframes draw-path {
            0% { stroke-dasharray: 500; stroke-dashoffset: 500; }
            100% { stroke-dasharray: 500; stroke-dashoffset: 0; }
          }
          .animate-draw-path {
            animation: draw-path 3s ease-in-out infinite;
          }
          .heart-path {
            stroke-dasharray: 500;
            stroke-dashoffset: 0;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-pulse {
            animation: pulse 1.5s infinite ease-in-out;
          }
          .particle {
            position: absolute;
            width: 12px;
            height: 12px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E") no-repeat center;
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
          .particle-2 {
            color: #7c3aed;
            top: 40%;
            left: 70%;
            animation-delay: 3s;
            transform: scale(1);
          }
          .particle-3 {
            color: #d8b4fe;
            top: 60%;
            left: 30%;
            animation-delay: 6s;
            transform: scale(0.6);
          }
          .particle-4 {
            color: #a78bfa;
            top: 80%;
            left: 50%;
            animation-delay: 9s;
            transform: scale(1.2);
          }
          @keyframes particle-float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
            50% { opacity: 0.4; }
            100% { transform: translateY(-80vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
}