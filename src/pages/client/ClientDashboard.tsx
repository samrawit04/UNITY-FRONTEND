
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { format, isAfter, subMinutes, isBefore, addDays } from "date-fns";
import Navbar from "./component/Navbar";
import Rating from "react-rating-stars-component";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export default function ClientDashboard() {
  interface MyJwtPayload {
    id: string;
    email: string;
    [key: string]: any;
  }

  const navigate = useNavigate();
  const sessionsRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [rated, setRated] = useState({});
  const [sessions, setSessions] = useState([]);
  const [sessionMessages, setSessionMessages] = useState<{ [key: string]: string }>({});
  const [modalOpen, setModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [thankYou, setThankYou] = useState(false);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState("sessions");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Motivational quotes for carousel
  const quotes = [
    "Love grows stronger with every conversation.",
    "Together, build a marriage that lasts a lifetime.",
    "Every step forward is a step closer to each other.",
    "Connect deeply, love fully, start today.",
  ];

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Fetch client profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        const res = await axios.get(
          `http://localhost:3000/clients/profile/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("User ID:", decoded.id);
        setProfile(res.data);
        setClientId(decoded.id);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!clientId) {
        console.warn("No clientId available, skipping session fetch");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/clientbooking/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Sessions API response:", response.data);
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error.response?.data || error.message);
        setSessions([]);
      }
    };

    fetchSessions();
  }, [clientId]);

  // Update counselors from sessions and local storage
  useEffect(() => {
    const updateCounselors = () => {
      const sessionCounselors = sessions
        .filter((session) => session.counselor)
        .map((session) => ({
          id: session.counselor.id || session.counselor.userId,
          firstName: session.counselor.firstName || "Unknown",
          lastName: session.counselor.lastName || "",
          image: session.counselor.image || null,
          specialization: session.counselor.specialization || "Counselor",
        }));

      const storedCounselorIds = JSON.parse(localStorage.getItem("recentCounselorIds") || "[]");
      const recentCounselors = sessions
        .filter((session) => session.counselor && storedCounselorIds.includes(session.counselor.id || session.counselor.userId))
        .map((session) => ({
          id: session.counselor.id || session.counselor.userId,
          firstName: session.counselor.firstName || "Unknown",
          lastName: session.counselor.lastName || "",
          image: session.counselor.image || null,
          specialization: session.counselor.specialization || "Counselor",
        }));

      const allCounselors = [...sessionCounselors, ...recentCounselors];
      const uniqueCounselors = Array.from(
        new Map(allCounselors.map((c) => [c.id, c])).values()
      );

      console.log("Updated counselors:", uniqueCounselors);
      setCounselors(uniqueCounselors);
    };

    updateCounselors();
  }, [sessions]);

  // Fetch client's previous reviews
  useEffect(() => {
    if (!clientId) return;
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/reviews/client/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const ratingsMap = {};
        res.data.forEach((review) => {
          const counselorId = review.counselor?.userId || review.counselorId;
          ratingsMap[counselorId] = review.rating;
        });
        setRated(ratingsMap);
      } catch (err) {
        console.error("Failed to fetch client reviews:", err.response?.data || err.message);
      }
    };
    fetchReviews();
  }, [clientId]);

  // Drag scroll hook for sessions
  const useDragScroll = (ref: React.RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      let isDown = false,
        startX: number,
        scrollLeft: number;
      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        el.classList.add("cursor-grabbing");
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      };
      const stop = () => {
        isDown = false;
        el.classList.remove("cursor-grabbing");
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = scrollLeft - (x - startX) * 2;
      };

      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mouseleave", stop);
      el.addEventListener("mouseup", stop);
      el.addEventListener("mousemove", onMouseMove);

      return () => {
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mouseleave", stop);
        el.removeEventListener("mouseup", stop);
        el.removeEventListener("mousemove", onMouseMove);
      };
    }, [ref]);
  };

  useDragScroll(sessionsRef);

  // Scroll buttons for sessions
  const scrollLeft = () => {
    if (sessionsRef.current) {
      sessionsRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sessionsRef.current) {
      sessionsRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Submit review
  const submitReview = async () => {
    const comment = comments[selectedCounselor?.id]?.trim();
    const rating = ratings[selectedCounselor?.id] || 0;

    if (!comment) {
      setFormError("Please enter a comment before submitting your review.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/reviews",
        {
          counselorId: selectedCounselor.id,
          clientId,
          comment,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRated((prev) => ({
        ...prev,
        [selectedCounselor.id]: rating,
      }));
      setThankYou(true);
      setFormError("");
    } catch (err) {
      setFormError("Failed to submit review.");
    }
  };

  // Fetch counselor availability for reschedule
  const handleReschedule = async (session: any) => {
    const counselorId = session.counselor?.id || session.counselor?.userId;
    if (!counselorId) {
      setSessionMessages((prev) => ({
        ...prev,
        [session.id]: "Counselor ID not found for this session.",
      }));
      setTimeout(() => {
        setSessionMessages((prev) => ({ ...prev, [session.id]: "" }));
      }, 5000);
      return;
    }

    try {
      const startDate = format(new Date(), "yyyy-MM-dd");
      const endDate = format(addDays(new Date(), 30), "yyyy-MM-dd");
      const response = await axios.get(
        `http://localhost:3000/schedule/available`,
        {
          params: {
            startDate,
            endDate,
            counselorId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const schedules = response.data;
      const availability = {
        dates: Object.entries(
          schedules.reduce((acc: any, { date, id, startTime, endTime }: any) => {
            if (!acc[date]) acc[date] = [];
            acc[date].push({ id, startTime, endTime });
            return acc;
          }, {})
        ).map(([date, times]) => ({ date, times })),
      };
      console.log("Navigating to reschedule with:", { session, availability, clientId });
      navigate("/reschedule", { state: { session, availability, clientId } });
    } catch (error) {
      console.error("Error fetching availability:", error.response?.data || error.message);
      setSessionMessages((prev) => ({
        ...prev,
        [session.id]: "Failed to fetch counselor availability.",
      }));
      setTimeout(() => {
        setSessionMessages((prev) => ({ ...prev, [session.id]: "" }));
      }, 5000);
    }
  };

  // Check if session is joinable
  const isSessionJoinable = (session: { date: string; startTime: string; endTime: string }) => {
    const now = new Date();
    const sessionDateTime = new Date(`${session.date} ${session.startTime}`);
    const sessionEndTime = new Date(`${session.date} ${session.endTime}`);
    const tenMinutesBefore = subMinutes(sessionDateTime, 10);
    return isAfter(now, tenMinutesBefore) && isBefore(now, sessionEndTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 font-poppins relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-violet-600 to-purple-600 text-white py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {profile?.user?.firstName || "User"}!
          </h1>
          <p className="mt-2 text-lg opacity-80">
            Manage your sessions and connect with your counselors.
          </p>
          <button
            onClick={() => navigate("/book-session")}
            className="mt-6 bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-50 transition transform hover:scale-105"
          >
            Book a Session
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-wave-pattern bg-cover opacity-10"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {sessions.length === 0 ? (
          <section className="relative bg-white/95 rounded-2xl p-8 shadow-lg backdrop-blur-sm animate-fade-in text-center overflow-hidden">
            <div className="absolute inset-0 animate-gradient-bg"></div>
            <div className="relative z-10">
              {/* Animated SVG Illustration */}
              <div className="mb-6 flex justify-center">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-draw-path"
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
              </div>
              {/* Quote Carousel */}
              <div className="mb-6 h-20 relative">
                {quotes.map((quote, index) => (
                  <p
                    key={index}
                    className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] absolute w-full transition-opacity duration-1000 ${
                      index === currentQuoteIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  >
                    "{quote}"
                  </p>
                ))}
              </div>
              {/* Call to Action */}
              <button
                onClick={() => navigate("/book-session")}
                className="bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-110 animate-glow"
              >
                Book Your First Session
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8 animate-fade-in">
              <button
                className={`flex-1 py-4 text-lg font-medium text-center transition-colors ${
                  activeTab === "sessions"
                    ? "text-indigo-600 border-b-4 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
                onClick={() => setActiveTab("sessions")}
              >
                Your Sessions
              </button>
              <button
                className={`flex-1 py-4 text-lg font-medium text-center transition-colors ${
                  activeTab === "counselors"
                    ? "text-indigo-600 border-b-4 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
                onClick={() => setActiveTab("counselors")}
              >
                Your Counselors
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "sessions" && (
              <section className="animate-fade-in relative">
                <div className="mb-4">
                  {Object.entries(sessionMessages).map(([sessionId, message]) => (
                    message && (
                      <div key={sessionId} className="text-red-600 text-sm mb-2 animate-fade-in">
                        {message}
                      </div>
                    )
                  ))}
                </div>
                <div className="relative">
                  <div
                    ref={sessionsRef}
                    className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory cursor-grab pb-4"
                  >
                    {sessions.map((session, idx) => (
                      <div
                        key={session.id || idx}
                        className="flex-none w-80 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transform transition-colors hover:bg-gray-50 snap-start mx-2"
                      >
                        {session.counselor?.image ? (
                          <img
                            src={`http://localhost:3000/uploads/profile-pictures/${session.counselor.image}`}
                            alt={`${session.counselor.firstName} ${session.counselor.lastName}`}
                            className="w-20 h-20 rounded-full mx-auto object-cover mb-4 border-2 border-[#4b2a75]/30"
                            onError={(e) => (e.currentTarget.src = "/path/to/images/default-avatar.jpg")}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-[#4b2a75]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#4b2a75]/30">
                            <span className="text-2xl font-bold text-[#4b2a75]">
                              {session.counselor?.firstName?.charAt(0)?.toUpperCase() ||
                                session.counselor?.lastName?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </span>
                          </div>
                        )}
                        <div
                          className="font-semibold text-[#4b2a75] mb-3 cursor-pointer hover:underline text-center"
                          onClick={() => {
                            if (isSessionJoinable(session)) {
                              if (session.zoomJoinUrl) {
                                const counselorId = session.counselor?.id || session.counselor?.userId;
                                if (counselorId) {
                                  const storedIds = JSON.parse(localStorage.getItem("recentCounselorIds") || "[]");
                                  const updatedIds = [...new Set([...storedIds, counselorId])];
                                  localStorage.setItem("recentCounselorIds", JSON.stringify(updatedIds));
                                  console.log("Stored counselor ID:", counselorId);
                                }

                                window.open(session.zoomJoinUrl, "_blank");
                              } else {
                                setSessionMessages((prev) => ({
                                  ...prev,
                                  [session.id || idx]: "No Zoom link available for this session.",
                                }));
                                setTimeout(() => {
                                  setSessionMessages((prev) => ({
                                    ...prev,
                                    [session.id || idx]: "",
                                  }));
                                }, 5000);
                              }
                            } else {
                              setSessionMessages((prev) => ({
                                ...prev,
                                [session.id || idx]: "The session is not yet available. Please try again within 10 minutes of the scheduled time.",
                              }));
                              setTimeout(() => {
                                setSessionMessages((prev) => ({
                                  ...prev,
                                  [session.id || idx]: "",
                                }));
                              }, 5000);
                            }
                          }}
                        >
                          Join Session
                        </div>
                        <div className="text-gray-600 text-sm text-center">
                          <span className="font-medium">Date:</span>{" "}
                          {session.date ? format(new Date(session.date), "MMM d, yyyy") : "N/A"}
                        </div>
                        <div className="text-gray-600 text-sm text-center">
                          <span className="font-medium">Time:</span> {session.startTime || "N/A"}
                        </div>
                        <div className="text-gray-600 text-sm text-center">
                          <span className="font-medium">Counselor:</span>{" "}
                          {session.counselor
                            ? `${session.counselor.firstName} ${session.counselor.lastName}`
                            : "Unknown"}
                        </div>
                        <button
                          className="mt-4 w-full bg-[#4b2a75] text-white font-semibold py-2 rounded-full shadow hover:bg-[#3a2057] transition transform hover:scale-105"
                          onClick={() => handleReschedule(session)}
                        >
                          Reschedule
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Scroll Buttons */}
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#4b2a75]/80 text-white p-2 rounded-full shadow-lg hover:bg-[#4b2a75] transition opacity-0 group-hover:opacity-100"
                  >
                    <IconArrowLeft size={24} />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#4b2a75]/80 text-white p-2 rounded-full shadow-lg hover:bg-[#4b2a75] transition opacity-0 group-hover:opacity-100"
                  >
                    <IconArrowRight size={24} />
                  </button>
                </div>
              </section>
            )}

            {activeTab === "counselors" && (
              <section className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {counselors.length > 0 ? (
                    counselors.map((counselor, idx) => {
                      const fullName = `${counselor.firstName ?? "Unknown"} ${
                        counselor.lastName ?? ""
                      }`.trim();
                      const initial = counselor.firstName?.charAt(0).toUpperCase() || "?";

                      return (
                        <div
                          key={counselor.id || idx}
                          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform transition-colors hover:bg-gray-50"
                        >
                          {counselor.image ? (
                            <img
                              src={`http://localhost:3000/uploads/profile-pictures/${counselor.image}`}
                              alt={fullName}
                              className="w-20 h-20 rounded-full mx-auto object-cover mb-4 border-2 border-[#4b2a75]/30"
                              onError={(e) => (e.currentTarget.src = "/path/to/images/default-avatar.jpg")}
                            />
                          ) : (
                            <div className="w-20 h-20 bg-[#4b2a75]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#4b2a75]/30">
                              <span className="text-2xl font-bold text-[#4b2a75]">{initial}</span>
                            </div>
                          )}
                          <div className="font-semibold text-gray-800 text-center mb-2">
                            {fullName}
                          </div>
                          <div className="text-gray-600 text-sm text-center mb-3">
                            {counselor.specialization || "Counselor"}
                          </div>
                          {rated[counselor.id] ? (
                            <div className="flex justify-center">
                              <Rating
                                count={5}
                                size={24}
                                edit={false}
                                value={rated[counselor.id]}
                                activeColor="#ffd700"
                              />
                            </div>
                          ) : (
                            <button
                              className="w-full bg-[#4b2a75] text-white font-semibold py-2 rounded-full shadow hover:bg-[#3a2057] transition transform hover:scale-105"
                              onClick={() => {
                                setModal(true);
                                setSelectedCounselor(counselor);
                                setThankYou(false);
                                setFormError("");
                              }}
                            >
                              Rate Counselor
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-600 text-lg col-span-full text-center py-8 bg-gray-100 rounded-lg">
                      No counselors found.
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Rating Modal */}
      {modalOpen && selectedCounselor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => {
                setModal(false);
                setSelectedCounselor(null);
              }}
            >
              ✗
            </button>
            {!thankYou ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Rate {selectedCounselor.firstName}
                </h3>
                <textarea
                  value={comments[selectedCounselor.id] || ""}
                  onChange={(e) => {
                    setComments((prev) => ({
                      ...prev,
                      [selectedCounselor.id]: e.target.value,
                    }));
                    setFormError("");
                  }}
                  placeholder="Share your feedback..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm focus:ring-2 focus:ring-[#4b2a75] focus:border-transparent"
                  rows={4}
                />
                {formError && (
                  <p className="text-red-600 text-sm mb-3 text-center">{formError}</p>
                )}
                <div className="flex justify-center mb-4">
                  <Rating
                    count={5}
                    size={32}
                    activeColor="#ffd700"
                    value={ratings[selectedCounselor.id] || 0}
                    onChange={(val) =>
                      setRatings((prev) => ({
                        ...prev,
                        [selectedCounselor.id]: val,
                      }))
                    }
                  />
                </div>
                <button
                  className="w-full bg-[#4b2a75] text-white font-semibold py-3 rounded-full shadow-lg hover:bg-[#3a2057] transition transform hover:scale-105"
                  onClick={submitReview}
                >
                  Submit Review
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-2xl font-semibold text-green-600 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">Your review has been submitted.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
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
        @keyframes glow {
          0% { box-shadow: 0 0 10px rgba(75, 42, 117, 0.5); }
          50% { box-shadow: 0 0 20px rgba(75, 42, 117, 0.8); }
          100% { box-shadow: 0 0 10px rgba(75, 42, 117, 0.5); }
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }
        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg {
          background: linear-gradient(270deg, #f0f4ff, #e4ccff, #c5d7ff);
          background-size: 400% 400%;
          animation: gradient-bg 15s ease infinite;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
        .group:hover .group-hover\\:opacity {
          opacity: 1;
        }
        .bg-wave-pattern {
          background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z"></path></svg>') no-repeat center;
          background-size: cover;
        }
      `}</style>
    </div>
  );
}