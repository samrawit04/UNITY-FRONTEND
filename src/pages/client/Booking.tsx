// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isToday,
//   isSameMonth,
//   isSameDay,
//   isBefore,
//   startOfToday,
//   parse,
// } from "date-fns";
// import { useNavigate, useParams } from "react-router-dom";

// interface TimeSlot {
//   id?: number;
//   start: string;
//   end: string;
// }

// interface DaySchedule {
//   date: string;
//   slots: TimeSlot[];
// }

// const API_URL = "http://localhost:3000";
// const counselorId = 1; 

// export default function Booking() {
//   const navigate = useNavigate();
//   const params = useParams<{ yearMonth?: string }>();

//   // Parse yearMonth param or default to current date
//   const initialMonth = params.yearMonth
//     ? parse(params.yearMonth, "yyyy-MM", new Date())
//     : new Date();

//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [currentMonth, setCurrentMonth] = useState<Date>(
//     startOfMonth(initialMonth),
//   );
//   const [schedule, setSchedule] = useState<DaySchedule[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

//   const today = startOfToday();

//   const days = eachDayOfInterval({
//     start: startOfMonth(currentMonth),
//     end: endOfMonth(currentMonth),
//   });

//   useEffect(() => {
//     const fetchSchedule = async () => {
//       const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
//       const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");

//       try {
//         const res = await axios.get(`${API_URL}/schedule/available`, {
//           params: {
//             startDate,
//             endDate,
//             counselorId,
//           },
//         });

//         const scheduleMap: Record<string, TimeSlot[]> = {};
//         res.data.forEach((slot: any) => {
//           const dateStr = slot.date.split("T")[0];
//           if (!scheduleMap[dateStr]) scheduleMap[dateStr] = [];
//           scheduleMap[dateStr].push({
//             id: slot.id,
//             start: slot.startTime,
//             end: slot.endTime,
//           });
//         });

//         const newSchedule: DaySchedule[] = Object.entries(scheduleMap).map(
//           ([date, slots]) => ({
//             date,
//             slots,
//           }),
//         );

//         setSchedule(newSchedule);
//       } catch (err) {
//         console.error("Failed to fetch schedule", err);
//       }
//     };

//     fetchSchedule();
//   }, [currentMonth]);

//   const getDateSchedule = (date: Date): TimeSlot[] => {
//     const dateStr = format(date, "yyyy-MM-dd");
//     const daySchedule = schedule.find((s) => s.date === dateStr);
//     return daySchedule?.slots || [];
//   };

//   const handleDateClick = (date: Date) => {
//     if (isBefore(date, today)) return;
//     setSelectedDate(date);
//     setSelectedSlot(null); // Reset selected time slot when date changes
//   };

//   // Navigate to prev month page
//   const handlePrevMonth = () => {
//     const prevMonth = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth() - 1,
//     );
//     const url = `/booking/${format(prevMonth, "yyyy-MM")}`;
//     navigate(url);
//   };

//   // Navigate to next month page
//   const handleNextMonth = () => {
//     const nextMonth = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth() + 1,
//     );
//     const url = `/booking/${format(nextMonth, "yyyy-MM")}`;
//     navigate(url);
//   };

//   const handleBookSlot = async () => {
//     if (!selectedDate || !selectedSlot) return;

//     try {
//       await axios.post(`${API_URL}/api/bookings`, {
//         scheduleId: selectedSlot.id,
//         counselorId,
//         clientName: "lidiya",
//         clientEmail: "lidiya@gmail.com",
//       });

//       alert("Booking confirmed!");

//       // Remove the booked slot from schedule state
//       const dateStr = format(selectedDate, "yyyy-MM-dd");
//       setSchedule((prevSchedule) =>
//         prevSchedule.map((day) =>
//           day.date === dateStr
//             ? {
//                 ...day,
//                 slots: day.slots.filter((slot) => slot.id !== selectedSlot.id),
//               }
//             : day,
//         ),
//       );

//       setSelectedSlot(null);
//     } catch (err) {
//       console.error("Booking failed", err);
//       alert("Failed to book the slot.");
//     }
//   };

//   return (
//     <div className="flex gap-8 p-8">
//       {/* Calendar Panel */}
//       <div className="w-96 rounded-lg bg-white shadow">
//         <div className="flex items-center justify-between border-b px-6 py-2">
//           <span className="text-lg font-semibold">
//             {format(currentMonth, "MMMM yyyy")}
//           </span>
//           <div className="flex gap-2">
//             <button
//               onClick={handlePrevMonth}
//               className="p-1 hover:bg-gray-100 rounded">
//               ←
//             </button>
//             <button
//               onClick={handleNextMonth}
//               className="p-1 hover:bg-gray-100 rounded">
//               →
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-7 gap-px bg-gray-200 text-center text-xs font-semibold">
//           {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
//             <div key={day} className="bg-white py-2">
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-px bg-gray-200">
//           {days.map((day) => {
//             const dateStr = format(day, "yyyy-MM-dd");
//             const hasSlots = schedule.some((s) => s.date === dateStr);
//             const isPastDate = isBefore(day, today);
//             const isDisabled = isPastDate || !hasSlots;

//             return (
//               <button
//                 key={day.toString()}
//                 onClick={() => !isDisabled && handleDateClick(day)}
//                 disabled={isDisabled}
//                 className={`bg-white py-4 text-center relative
//                   ${!isSameMonth(day, currentMonth) && "text-gray-400"}
//                   ${isToday(day) && "font-bold text-blue-600"}
//                   ${
//                     selectedDate && isSameDay(day, selectedDate)
//                       ? "bg-blue-100"
//                       : ""
//                   }
//                   ${
//                     isDisabled
//                       ? "cursor-not-allowed bg-gray-100 text-gray-400"
//                       : "hover:bg-gray-50"
//                   }
//                 `}>
//                 {format(day, "d")}
//                 {hasSlots && !isDisabled && (
//                   <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
//                   </div>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Booking Panel */}
//       {selectedDate && (
//         <div className="flex-1 rounded-lg bg-white p-6 shadow">
//           <h2 className="text-lg font-semibold mb-6">
//             {format(selectedDate, "EEE MMM dd yyyy")} GMT+0300 (East Africa
//             Time)
//           </h2>

//           <div>
//             <h3 className="font-medium mb-4">Available Time Slots</h3>
//             <div className="grid grid-cols-2 gap-4">
//               {getDateSchedule(selectedDate).map((slot) => (
//                 <button
//                   key={slot.id}
//                   onClick={() => setSelectedSlot(slot)}
//                   className={`flex items-center justify-between px-4 py-2 rounded-md border 
//                     ${
//                       selectedSlot?.id === slot.id
//                         ? "bg-blue-600 text-white"
//                         : "bg-blue-50 hover:bg-blue-100"
//                     }`}>
//                   {slot.start} - {slot.end}
//                 </button>
//               ))}
//             </div>
//             {selectedSlot && (
//               <div className="mt-6">
//                 <button
//                   onClick={handleBookSlot}
//                   className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
//                   Confirm Booking
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
