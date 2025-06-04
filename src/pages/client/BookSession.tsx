import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
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
  subMonths,
  addMonths,
  parse,
} from "date-fns";
import Navbar from "./component/Navbar";
import { jwtDecode } from "jwt-decode";

interface TimeSlot {
  id?: string;
  start: string;
  end: string;
}

interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  averageRating?: number;
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

interface Client {
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bookings: any[];
  payments: any[];
}

interface PaymentResponse {
  status: string;
  transactionReference: string;
  amount: number;
  verifiedAt?: string;
  counselorId?: string;
  scheduleId?: string;
  clientId?: string;
}

const API_URL = "http://localhost:3000";

const BookSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ yearMonth?: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    amount: "1000",
  });
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  useEffect(() => {
    const storedTherapist = localStorage.getItem("selectedTherapist");
    const storedDate = localStorage.getItem("selectedDate");
    const storedSlot = localStorage.getItem("selectedSlot");

    if (storedTherapist) {
      setSelectedTherapist(JSON.parse(storedTherapist));
    }
    if (storedDate) {
      setSelectedDate(new Date(JSON.parse(storedDate)));
    }
    if (storedSlot) {
      setSelectedSlot(JSON.parse(storedSlot));
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const txRef = queryParams.get("txRef");
    if (txRef && location.pathname.includes("/payment/success")) {
      setCurrentStep(5);
      verifyPayment(txRef);
    }
  }, [location]);

  const verifyPayment = async (txRef: string, attempt = 1, maxAttempts = 1) => {
    console.time("verifyPayment");
    setPaymentStatus("verifying");
    try {
      const response = await axios.get(`${API_URL}/payment/verify/${txRef}`, {
        timeout: 10000,
      });
      console.timeEnd("verifyPayment");
      console.log("verifyPayment response:", response.data);
      if (response.data.status === "success") {
        setPaymentStatus("success");
        setPaymentData(response.data);
      } else {
        throw new Error("Payment not successful");
      }
    } catch (err) {
      console.timeEnd("verifyPayment");
      setPaymentStatus("error");
      setErrorMessage("Payment verification failed. Please try again or contact support.");
      console.error("Payment verification error:", err);
    }
  };

  useEffect(() => {
    const fetchTherapistsAndRatings = async () => {
      try {
        const [therapistsRes, ratingsRes] = await Promise.all([
          axios.get(`${API_URL}/counselors`),
          axios.get(`${API_URL}/reviews/averages`),
        ]);

        const ratingsMap = ratingsRes.data.reduce((map: any, rating: any) => {
          map[rating.counselorId] = parseFloat(rating.averageRating).toFixed(1);
          return map;
        }, {});

        const therapistsWithRatings = therapistsRes.data.map((therapist: any) => ({
          ...therapist,
          averageRating: ratingsMap[therapist.id] || "N/A",
        }));

        setTherapists(therapistsWithRatings);
      } catch (err) {
        console.error("Failed to fetch therapists or ratings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistsAndRatings();
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decoded: DecodedToken = jwtDecode(token);
        if (!decoded?.id) throw new Error("Invalid token");

        const response = await axios.get(`${API_URL}/clients/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClientData(response.data);
        setFormData((prev) => ({
          ...prev,
          email: response.data.user.email || "",
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
        }));
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedTherapist?.id) return;
      const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");

      try {
        const res = await axios.get(`${API_URL}/schedule/available`, {
          params: {
            startDate,
            endDate,
            counselorId: selectedTherapist.id,
          },
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
          })
        );

        setSchedule(newSchedule);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      }
    };

    fetchSchedule();
  }, [selectedTherapist, currentMonth]);

  const handleNextStep = () => {
    if (currentStep === 2 && (!selectedSlot || !selectedSlot.id)) {
      alert("Please select a valid time slot.");
      return;
    }
    if (!selectedTherapist?.id) {
      alert("Please select a counselor.");
      return;
    }
    if (!clientData?.user.id) {
      alert("Client information missing. Please log in again.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (!clientData?.user?.email) {
    alert("Client email not found.");
    return;
  }

  if (!selectedSlot?.id) {
    alert("Please select a valid schedule slot.");
    return;
  }

  if (!selectedTherapist?.id) {
    alert("Please select a valid counselor.");
    return;
  }

  localStorage.setItem("selectedTherapist", JSON.stringify(selectedTherapist));
  localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
  localStorage.setItem("selectedSlot", JSON.stringify(selectedSlot));

  const txRef = `tx-${Date.now()}`;
  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: clientData.user.email,
    amount: parseFloat(formData.amount), // Ensure amount is a number
    clientId: clientData.user.id,
    counselorId: selectedTherapist.id,
    scheduleId: selectedSlot.id,
    transactionReference: txRef,
  };

  try {
    console.log('Payment payload:', payload); // Debug payload
    const res = await axios.post(`${API_URL}/payment/initialize`, payload);
    console.log('Payment response:', res.data); // Debug response
    if (res.data.chapaRedirectUrl) {
      window.location.href = res.data.chapaRedirectUrl;
    } else {
      alert(res.data.message || "Payment initialization failed.");
    }
  } catch (err) {
    console.error('Payment initialization error:', err.response?.data || err.message); // Debug error
    alert("Error initializing payment. Please try again.");
  }
};

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

  const steps = [
    { id: 1, title: "Choose Counselor" },
    { id: 2, title: "Select Time" },
    { id: 3, title: "Summary" },
    { id: 4, title: "Payment" },
    { id: 5, title: "Confirmation" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 font-poppins relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-[#4b2a75]/10">
          {currentStep < 5 && (
            <div className="mb-6">
              <div className="flex flex-wrap justify-between items-center gap-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep >= step.id
                          ? "bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 hidden sm:block">
                      {step.title}
                    </span>
                    {index !== steps.length - 1 && (
                      <div
                        className={`w-8 sm:w-12 h-1 mx-2 rounded-full ${
                          currentStep > step.id
                            ? "bg-gradient-to-r from-[#4b2a75] to-[#7c3aed]"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#4b2a75] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] animate-slide-up">
                Choose Your Counselor
              </h2>
              {loading ? (
                <div className="text-center text-[#4b2a75] animate-pulse">
                  Loading counselors...
                </div>
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scroll snap-x">
                  {therapists.map((therapist) => {
                    const firstLetter =
                      therapist.firstName?.[0]?.toUpperCase() ||
                      therapist.lastName?.[0]?.toUpperCase() ||
                      "?";
                    return (
                      <div
                        key={therapist.id}
                        onClick={() =>
                          setSelectedTherapist({
                            id: therapist.id,
                            fullName: `${therapist.firstName} ${therapist.lastName}`,
                            image: therapist.image
                              ? `${API_URL}/Uploads/profile-pictures/${therapist.image}`
                              : null,
                            firstLetter,
                            averageRating: therapist.averageRating,
                          })
                        }
                        className="flex-none w-60 bg-white/90 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all snap-start border-2 border-[#4b2a75]/10 hover:border-[#4b2a75]/30 hover:shadow-lg animate-slide-up"
                      >
                        <div className="flex justify-center mb-3">
                          {therapist.image ? (
                            <img
                              src={`${API_URL}/Uploads/profile-pictures/${therapist.image}`}
                              alt={`${therapist.firstName} ${therapist.lastName}`}
                              className="w-16 h-16 rounded-full object-cover border-2 border-[#4b2a75]/20"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[#4b2a75] flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">
                                {firstLetter}
                              </span>
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-center text-[#4b2a75] mb-2">
                          {therapist.firstName} {therapist.lastName}
                        </h4>
                        <div className="flex justify-center items-center mb-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-xs text-gray-600 ml-1">
                            {therapist.averageRating || "N/A"}
                          </span>
                        </div>
                        <button
                          className="w-full text-xs text-[#4b2a75] underline hover:text-[#7c3aed] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/counselor-profile", {
                              state: {
                                therapist: {
                                  id: therapist.id,
                                  fullName: `${therapist.firstName} ${therapist.lastName}`,
                                  image: therapist.image,
                                  firstLetter,
                                  averageRating: therapist.averageRating,
                                },
                              },
                            });
                          }}
                        >
                          View Profile
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    selectedTherapist && setCurrentStep(currentStep + 1)
                  }
                  className={`px-6 py-2 rounded-lg font-medium transition-transform transform hover:scale-105 ${
                    selectedTherapist
                      ? "bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!selectedTherapist}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#4b2a75] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] animate-slide-up">
                Select Time Slot
              </h2>
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 border-2 border-[#4b2a75]/10 animate-slide-up">
                {selectedTherapist?.image ? (
                  <img
                    src={selectedTherapist.image}
                    alt={selectedTherapist.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#4b2a75]/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#4b2a75] flex items-center justify-center text-white text-lg font-bold">
                    {selectedTherapist?.firstLetter || "?"}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-[#4b2a75] text-sm">
                    {selectedTherapist?.fullName}
                  </h4>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-xs text-gray-600 ml-1">
                      {selectedTherapist?.averageRating || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-72 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border-2 border-[#4b2a75]/10 animate-slide-up">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#4b2a75]">
                      {format(currentMonth, "MMMM yyyy")}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-[#f5f0ff] rounded-full transition"
                      >
                        <svg
                          className="w-4 h-4 text-[#4b2a75]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-[#f5f0ff] rounded-full transition"
                      >
                        <svg
                          className="w-4 h-4 text-[#4b2a75]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-[#4b2a75]/10 text-center text-xs font-semibold text-[#4b2a75] uppercase">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                      (day) => (
                        <div
                          key={day}
                          className="bg-white/90 py-1 text-[10px]"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-[#4b2a75]/10">
                    {days.map((day) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const hasSlots = schedule.some(
                        (s) => s.date === dateStr
                      );
                      const isPastDate = isBefore(day, today);
                      const isDisabled = isPastDate || !hasSlots;
                      return (
                        <button
                          key={day.toString()}
                          onClick={() => !isDisabled && handleDateClick(day)}
                          disabled={isDisabled}
                          className={`
                            bg-white/90 py-2 text-center relative transition-all text-xs
                            ${
                              !isSameMonth(day, currentMonth)
                                ? "text-gray-400"
                                : "text-gray-800"
                            }
                            ${isToday(day) ? "font-bold text-[#4b2a75]" : ""}
                            ${
                              selectedDate && isSameDay(day, selectedDate)
                                ? "bg-gradient-to-br from-[#4b2a75]/20 to-[#7c3aed]/20"
                                : isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "hover:bg-[#f5f0ff]"
                            }
                          `}
                        >
                          {format(day, "d")}
                          {hasSlots && !isDisabled && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                              <div className="w-1.5 h-1.5 bg-[#34d399] rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedDate && (
                  <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border-2 border-[#4b2a75]/10 animate-slide-up">
                    <h3 className="text-sm font-semibold text-[#4b2a75] mb-2">
                      {format(selectedDate, "EEEE, MMMM dd, yyyy")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getDateSchedule(selectedDate).length === 0 ? (
                        <div className="w-full text-center text-gray-600 text-xs py-2">
                          No time slots available.
                        </div>
                      ) : (
                        getDateSchedule(selectedDate).map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedSlot?.id === slot.id
                                ? "bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white"
                                : "bg-white border border-[#4b2a75]/20 hover:bg-[#f5f0ff]"
                            }`}
                          >
                            {slot.start} - {slot.end}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 rounded-lg border border-[#4b2a75] text-[#4b2a75] text-sm hover:bg-[#4b2a75]/10 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedSlot}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-transform transform hover:scale-105 ${
                    selectedSlot
                      ? "bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 &&
            selectedTherapist &&
            selectedDate &&
            selectedSlot && (
              <div>
                <h2 className="text-2xl font-bold text-[#4b2a75] mb-6">
                  Booking Summary
                </h2>
                <div className="bg-[#f5f0ff] rounded-lg p-6 mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    {selectedTherapist?.image ? (
                      <img
                        src={selectedTherapist.image}
                        alt={selectedTherapist.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#4b2a75] flex items-center justify-center text-white text-xl font-bold">
                        {selectedTherapist?.firstLetter || "?"}
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-[#4b2a75]">
                        {selectedTherapist?.fullName}
                      </h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {selectedTherapist?.averageRating || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {format(selectedDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">
                        {selectedSlot.start} - {selectedSlot.end}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">1 hour</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                      <span className="text-gray-600">Session Type</span>
                      <span className="font-medium">Online via Zoom</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Session Fee</span>
                      <span className="font-medium">1000 ETB</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-[#4b2a75] text-white px-6 py-2 rounded-md hover:bg-[#3a2057] transition-colors"
                  >
                    Go to Payment
                  </button>
                </div>
              </div>
            )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed]">
                Payment
              </h2>
              <div className="bg-white/90 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  {selectedTherapist?.image ? (
                    <img
                      src={selectedTherapist.image}
                      alt={selectedTherapist?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#4b2a75] flex items-center justify-center text-white text-xl font-bold">
                      {selectedTherapist?.firstLetter || "?"}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-[#4b2a75] text-sm">
                      {selectedTherapist?.fullName}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {selectedTherapist?.averageRating || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Total Amount</span>
                    <span className="font-medium text-[#4b2a75] text-sm">
                      1000 ETB
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white/95 rounded-lg p-4 shadow">
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-[#4b2a75]/30 p-2 rounded-lg bg-white text-sm text-gray-800 focus:ring-2 focus:ring-[#4b2a75] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-[#4b2a75]/30 p-2 rounded-lg bg-white text-sm text-gray-800 focus:ring-2 focus:ring-[#4b2a75] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      readOnly
                      className="w-full border border-[#4b2a75]/30 p-2 rounded-lg bg-gray-100 cursor-not-allowed text-sm text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Amount (ETB)
                    </label>
                    <input
                      name="amount"
                      type="number"
                      placeholder="Amount"
                      value={1000}
                      readOnly
                      className="w-full border border-[#4b2a75]/30 p-2 rounded-lg bg-gray-100 cursor-not-allowed text-sm text-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg bg-[#4b2a75] text-white font-medium text-sm hover:bg-[#3a2057] transition-colors"
                  >
                    Pay with Chapa
                  </button>
                </form>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center">
              {/* {console.log({ selectedTherapist, selectedDate, selectedSlot, paymentData })} */}
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#4b2a75] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] animate-slide-up">
                {paymentStatus === "verifying" ? "Verifying Payment..." : paymentStatus === "success" ? "Payment Confirmed 🎉" : "Payment Error"}
              </h2>
              <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 shadow-xl border-2 border-[#4b2a75]/10 animate-slide-up">
                {paymentStatus === "verifying" && (
                  <div className="flex flex-col items-center">
                    <div className="loader w-10 h-10 border-4 border-t-[#4b2a75] border-gray-200 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm text-gray-600">Please wait while we confirm your payment...</p>
                  </div>
                )}
                {paymentStatus === "success" && selectedTherapist && selectedDate && selectedSlot && paymentData ? (
                  <div>
                    <div className="flex justify-center mb-4">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-slide-up"
                      >
                        <path
                          d="M100 150 C80 150, 60 130, 60 100 C60 70 80 50 100 50 120 50 140 70 140 100 C140 130 120 150 100 150"
                          stroke="#4b2a75"
                          strokeWidth="8"
                          fill="none"
                          className="heart"
                        />
                        <path
                          d="M90 100 L100 110 L110 100"
                          stroke="#7c3aed"
                          strokeWidth="6"
                          fill="none"
                          className="heart"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Your payment was successful! Thank you for booking your counseling session.
                    </p>
                    <div className="bg-[#f5f0ff] rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-[#4b2a75] mb-2">Receipt</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Counselor</span>
                          <span className="font-medium">{selectedTherapist.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date</span>
                          <span className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time</span>
                          <span className="font-medium">{selectedSlot.start} - {selectedSlot.end}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount Paid</span>
                          <span className="font-medium">{paymentData.amount} ETB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction Ref</span>
                          <span className="font-medium">{paymentData.transactionReference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Verified At</span>
                          <span className="font-medium">
                            {paymentData.verifiedAt ? format(new Date(paymentData.verifiedAt), "PPp") : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">
                      A confirmation has been sent to <span className="font-medium">{formData.email}</span>. You can join the session via Zoom on the scheduled date.
                    </p>
                    <button
                      onClick={() => {
                        localStorage.removeItem("selectedTherapist");
                        localStorage.removeItem("selectedDate");
                        localStorage.removeItem("selectedSlot");
                        navigate("/client-dashboard");
                      }}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white font-semibold text-sm hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                ) : paymentStatus === "success" && (
                  <div>
                    <p className="text-sm text-gray-700 mb-4">
                      Payment verified, but booking details are unavailable. Please check your dashboard or contact support.
                    </p>
                    <button
                      onClick={() => {
                        localStorage.removeItem("selectedTherapist");
                        localStorage.removeItem("selectedDate");
                        localStorage.removeItem("selectedSlot");
                        navigate("/client-dashboard");
                      }}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white font-semibold text-sm hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/support")}
                      className="mt-2 px-4 py-2 rounded-lg border border-[#4b2a75] text-[#4b2a75] text-sm hover:bg-[#f5f0ff]"
                    >
                      Contact Support
                    </button>
                  </div>
                )}
                {paymentStatus === "error" && (
                  <div>
                    <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          const queryParams = new URLSearchParams(location.search);
                          const txRef = queryParams.get("txRef");
                          if (txRef) verifyPayment(txRef);
                        }}
                        className="px-4 py-2 rounded-lg bg-[#4b2a75] text-white text-sm hover:bg-[#3a2057]"
                      >
                        Retry
                      </button>
                      <button
                        onClick={() => navigate("/support")}
                        className="px-4 py-2 rounded-lg border border-[#4b2a75] text-[#4b2a75] text-sm hover:bg-[#f5f0ff]"
                      >
                        Contact Support
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pulse { animation: pulse 1.5s infinite ease-in-out; }
        .particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E") no-repeat center;
          background-size: contain;
          animation: particle-float 12s infinite linear;
        }
        .particle-1 { color: #4b2a75; top: 10%; left: 20%; animation-delay: 0s; transform: scale(0.8); }
        .particle-2 { color: #7c3aed; top: 40%; left: 70%; animation-delay: 3s; transform: scale(1); }
        .particle-3 { color: #d8b4fe; top: 60%; left: 30%; animation-delay: 6s; transform: scale(0.6); }
        .particle-4 { color: #a78bfa; top: 80%; left: 50%; animation-delay: 9s; transform: scale(0.5); }
        @keyframes particle-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .loader { border-top-color: #4b2a75; animation: spin 0.5s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default BookSession;