
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { format, isAfter, subMinutes, parse, isBefore } from "date-fns";
import Navbar from "./component/Navbar";
import Rating from "react-rating-stars-component";
import { IconHeart } from "@tabler/icons-react";

export default function ClientDashboard() {
  interface MyJwtPayload {
    id: string;
    email: string;
    [key: string]: any;
  }

  const navigate = useNavigate();
  const sessionsRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [rated, setRated] = useState({});
  const [sessions, setSessions] = useState([]);
  const [sessionMessages, setSessionMessages] = useState<{ [key: string]: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
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
    "Connect deeply, love fully, start today."
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
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProfile(res.data);
        setClientId(res.data.user.id);
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
  const useDragScroll = (ref) => {
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      let isDown = false,
        startX,
        scrollLeft;
      const onMouseDown = (e) => {
        isDown = true;
        el.classList.add("cursor-grabbing");
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      };
      const stop = () => {
        isDown = false;
        el.classList.remove("cursor-grabbing");
      };
      const onMouseMove = (e) => {
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

  // Submit review
  const submitReview = async () => {
    const comment = comments[selectedCounselor.id]?.trim();
    const rating = ratings[selectedCounselor.id] || 0;

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

  // Check if session is joinable
  const isSessionJoinable = (session: { date: string; startTime: string; endTime: string }) => {
    const now = new Date();
    const sessionDateTime = parse(
      `${session.date} ${session.startTime}`,
      "yyyy-MM-dd HH:mm:ss",
      new Date()
    );
    const sessionEndTime = parse(
      `${session.date} ${session.endTime}`,
      "yyyy-MM-dd HH:mm:ss",
      new Date()
    );
    const tenMinutesBefore = subMinutes(sessionDateTime, 10);
    return isAfter(now, tenMinutesBefore) && isBefore(now, sessionEndTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 font-sans relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-violet-400 to-purple-600 text-white py-5 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {profile?.user?.firstName || "User"}!
          </h1>
          <p className="mt-2 text-lg opacity-80">
            Manage your sessions and connect with your counselors.
          </p>
          <button
            onClick={() => navigate("/book-session")}
            className="mt-6 bg-white text-purple-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-50 transition transform hover:scale-105"
          >
            Book a Session
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-wave-pattern bg-cover opacity-10"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sessions.length === 0 ? (
          <section className="relative bg-white/95 rounded-2xl p-8 shadow-lg backdrop-blur-sm animate-fade-in text-center">
            <div className="relative z-10">
              {/* Heartbeat Animation */}
              <div className="mb-6 flex justify-center">
                <IconHeart
                  size={80}
                  className="text-purple-600 animate-heartbeat fill-indigo-600/200"
                />
              </div>
              {/* Quote Carousel */}
              <div className="mb-6 h-20">
                {quotes.map((quote, index) => (
                  <p
                    key={index}
                    className={`text-xl font-semibold text-purple-500 transition-opacity duration-1000 absolute w-full ${
                      index === currentQuoteIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {quote}
                  </p>
                ))}
              </div>
              {/* Call to Action */}
              <button
                onClick={() => navigate("/book-session")}
                className="cursor-pointer  bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 animate-glow"
              >
                Book Your First Session
              </button>
            </div>
            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
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
              <section className="animate-fade-in">
                <div className="mb-4">
                  {Object.entries(sessionMessages).map(([sessionId, message]) => (
                    message && (
                      <div key={sessionId} className="text-red-600 text-sm mb-2 animate">
                        {message}
                      </div>
                    )
                  ))}
                </div>
                <div
                  ref={sessionsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 no-scrollbar cursor-grab"
                >
                  {sessions.map((session, idx) => (
                    <div
                      key={session.id || idx}
                      className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transform transition-colors hover:bg-gray-50"
                    >
                      {session.counselor?.image ? (
                        <img
                          src={`http://localhost:3000/uploads/profile-pictures/${session.counselor.image}`}
                          alt={`${session.counselor.firstName} ${session.counselor.lastName}`}
                          className="w-20 h-20 rounded-full mx-auto object-cover mb-4 border-2 border-indigo-200"
                          onError={(e) => (e.currentTarget.src = "/path/to/images/default-avatar.jpg")}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-200">
                          <span className="text-2xl font-bold text-indigo-600">
                            {session.counselor?.firstName?.charAt(0)?.toUpperCase() ||
                              session.counselor?.lastName?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                      )}
                      <div
                        className="font-semibold text-indigo-700 mb-3 cursor-pointer hover:underline"
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
                      <div className="text-gray-600 text-sm">
                        <span className="font-medium">Date:</span>{" "}
                        {session.date ? format(new Date(session.date), "MMM d, yyyy") : "N/A"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        <span className="font-medium">Time:</span> {session.startTime || "N/A"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        <span className="font-medium">Counselor:</span>{" "}
                        {session.counselor
                          ? `${session.counselor.firstName} ${session.counselor.lastName}`
                          : "Unknown"}
                      </div>
                      <button
                        className="mt-4 w-full bg-indigo-500 text-white font-semibold py-2 rounded-full shadow hover:bg-indigo-600 transition transform hover:scale-105"
                        onClick={() => navigate(`/book-session/reschedule/${session.id}`)}
                      >
                        Reschedule
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "counselors" && (
              <section className="animate rounded-2xl">
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
                          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform transition-colors hover:bg-gray-50"
                        >
                          {counselor.image ? (
                            <img
                              src={`http://localhost:3000/uploads/profile-pictures/${counselor.image}`}
                              alt={fullName}
                              className="w-20 h-20 rounded-full mx-auto object-cover mb-4 border-2 border-indigo-200"
                              onError={(e) => (e.currentTarget.src = "/path/to/images/default-avatar.jpg")}
                            />
                          ) : (
                            <div className="w-20 h-20 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-200">
                              <span className="text-2xl font-bold text-indigo-600">{initial}</span>
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
                              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-full shadow hover:bg-indigo-700 transition transform hover:scale-105"
                              onClick={() => {
                                setModalOpen(true);
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
                setModalOpen(false);
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
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s infinite ease-in-out;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.8); }
          100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }
        .bg-wave-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,64C672,64,768,128,864,160C960,192,1056,192,1152,160C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
        }
        .particle {
          position: absolute;
          background: rgba(99, 102, 241, 0.6);
          border-radius: 50%;
          animation: float 15s infinite linear;
        }
        .particle-1 {
          width: 10px;
          height: 10px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        .particle-2 {
          width: 8px;
          height: 8px;
          top: 50%;
          left: 80%;
          animation-delay: 5s;
        }
        .particle-3 {
          width: 12px;
          height: 12px;
          top: 70%;
          left: 30%;
          animation-delay: 10s;
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}