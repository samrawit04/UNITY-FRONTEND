
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IconArrowLeft, IconArrowRight, IconPlus } from "@tabler/icons-react";
import Navbar from "./component/Navbar";
import { format, isAfter, subMinutes, isBefore } from "date-fns";

interface MyJwtPayload {
  id: string;
  email: string;
  [key: string]: any;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  image?: string | null;
}

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  zoomStartUrl?: string;
  client: Client;
}

export default function CounselorDashboard() {
  const navigate = useNavigate();
  const upcomingScrollRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<any>(null);
  const [counselorId, setCounselorId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionMessages, setSessionMessages] = useState<{ [key: string]: string }>({});
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [errorMessages, setError] = useState<string | null>(null);

  // Motivational quotes for carousel
  const quotes = [
    "Empower couples to build stronger bonds.",
    "Guide hearts toward lasting love.",
    "Every session is a step toward healing.",
    "Inspire connection, one conversation at a time.",
  ];

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Fetch counselor profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      try {
        await new Promise((res) => setTimeout(res, 500));
        const decoded = jwtDecode<MyJwtPayload>(token);
        const res = await axios.get(
          `http://localhost:3000/counselors/profile/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Counselor profile:", res.data);
        setProfile(res.data);
        setCounselorId(decoded.id);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // Fetch upcoming sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!counselorId) {
        console.warn("No counselorId available, skipping session fetch");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/counselorbooking/${counselorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Sessions API response:", JSON.stringify(response.data, null, 2));
        setSessions(response.data || []);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching sessions:", error.response?.data || error.message);
        setError("Failed to load sessions. Please try again later.");
        setSessions([]);
      }
    };

    fetchSessions();
  }, [counselorId]);

  // Drag scroll hook
  function useDragScroll(ref: React.RefObject<HTMLDivElement>) {
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        el.classList.add("cursor-grabbing");
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      };
      const onMouseLeave = () => {
        isDown = false;
        el.classList.remove("cursor-grabbing");
      };
      const onMouseUp = () => {
        isDown = false;
        el.classList.remove("cursor-grabbing");
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 2;
        el.scrollLeft = scrollLeft - walk;
      };

      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mousemove", onMouseMove);

      return () => {
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mouseleave", onMouseLeave);
        el.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("mousemove", onMouseMove);
      };
    }, [ref]);
  }

  useDragScroll(upcomingScrollRef);

  // Scroll buttons
  const scrollLeft = () => {
    if (upcomingScrollRef.current) {
      upcomingScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (upcomingScrollRef.current) {
      upcomingScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Check if session is joinable
  const isSessionJoinable = (session: Session) => {
    const now = new Date();
    const sessionDateTime = new Date(`${session.date} ${session.startTime}`);
    const sessionEndTime = new Date(`${session.date} ${session.endTime}`);
    const tenMinutesBefore = subMinutes(sessionDateTime, 10);
    return isAfter(now, tenMinutesBefore) && isBefore(now, sessionEndTime);
  };

  // Handle join session
  const handleJoinSession = (session: Session) => {
    if (!isSessionJoinable(session)) {
      setSessionMessages((prev) => ({
        ...prev,
        [session.id]: "The session is not yet available. Please try again within 10 minutes of the scheduled time.",
      }));
      setTimeout(() => {
        setSessionMessages((prev) => ({ ...prev, [session.id]: "" }));
      }, 5000);
      return;
    }

    if (session.zoomStartUrl) {
      window.open(session.zoomStartUrl, "_blank");
    } else {
      setSessionMessages((prev) => ({
        ...prev,
        [session.id]: "No Zoom host link available for this session.",
      }));
      setTimeout(() => {
        setSessionMessages((prev) => ({ ...prev, [session.id]: "" }));
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-lavender-100 font-poppins relative overflow-hidden">
      <Navbar />

      {/* Heart Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-purple-500 to-purple-800 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {profile?.firstName || "Counselor"}!
          </h1>
          <p className="mt-2 text-lg opacity-80">
            Manage your sessions and empower your clients.
          </p>
          <button
            onClick={() => navigate("/counselor/complete-profile")}
            className="mt-6 bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-100 transition transform hover:scale-105"
          >
            Edit Profile
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-wave-pattern bg-cover opacity-10" />
      </header>

      <main className="max-w-4xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
        {errorMessages && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-700 rounded-lg border border-red-200 animate-pulse">
            {errorMessages}
          </div>
        )}
        {sessions.length === 0 && !errorMessages ? (
          <section className="relative bg-white/95 rounded-2xl p-8 shadow-lg backdrop-blur-sm animate-slide-up text-center overflow-hidden">
            <div className="absolute inset-0 animate-gradient-bg" />
            <div className="relative z-10">
              {/* Animated SVG Illustration */}
              <div className="mb-6 flex justify-center">
                <svg
                  width="120"
                  height="120"
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
              <div className="mb-3 h-20 relative">
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
                onClick={() => navigate("/calendar")}
                className="bg-gradient-to-r from-[#4b2a75] to-[#7c3aed] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-110 animate-glow"
              >
                Add Availability
              </button>
            </div>
          </section>
        ) : (
          <section className="animate-slide-up">
            <h2 className="text-2xl font-semibold text-[#4b2a75] text-center mb-6">
              Upcoming Sessions
            </h2>
            <div className="mb-4">
              {Object.entries(sessionMessages).map(([sessionId, message]) => (
                message && (
                  <div key={sessionId} className="text-red-600 text-sm mb-2 animate-pulse">
                    {message}
                  </div>
                )
              ))}
            </div>
            <div className="relative group">
              <div
                ref={upcomingScrollRef}
                className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory cursor-grab pb-4"
              >
                {sessions.map((session, idx) => {
                  const fullName = session.client?.firstName === 'Unknown' && !session.client?.lastName
                    ? 'Pending Client'
                    : `${session.client?.firstName || 'Unknown'} ${session.client?.lastName || ''}`.trim();
                  const initial = session.client?.firstName?.charAt(0).toUpperCase() || "?";

                  return (
                    <div
                      key={session.id || idx}
                      className="flex-none w-80 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border-2 border-[#4b2a75]/20 mx-2 snap-start hover:shadow-xl transition-transform hover:scale-[1.02]"
                    >
                      {session.client?.image ? (
                        <img
                          src={`http://localhost:3000/uploads/profile-pictures/${session.client.image}`}
                          alt={fullName}
                          className="w-20 h-20 rounded-full mx-auto object-cover mb-3 border-2 border-[#4b2a75]/30"
                          onError={(e) => (e.currentTarget.src = "/path/to/images/default-avatar.png")}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#4b2a75]/10 flex items-center justify-center text-2xl font-bold text-[#4b2a75] mx-auto mb-3 border-2 border-[#4b2a75]/30">
                          {initial}
                        </div>
                      )}
                      <div className="text-lg font-semibold text-[#4b2a75] text-center mb-1">
                        {fullName}
                      </div>
                      <div className="text-gray-600 text-sm text-center">
                        <span className="font-medium">Date:</span>{" "}
                        {session.date ? format(new Date(session.date), "MMM d, yyyy") : "N/A"}
                      </div>
                      <div className="text-gray-600 text-sm text-center mb-3">
                        <span className="font-medium">Time:</span> {session.startTime || "N/A"}
                      </div>
                      <button
                        onClick={() => handleJoinSession(session)}
                        className="w-full bg-[#4b2a75] text-white font-semibold py-2 rounded-full shadow hover:bg-[#3a2057] transition transform hover:scale-105"
                      >
                        Join Session
                      </button>
                    </div>
                  );
                })}
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
      </main>

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
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
        .bg-wave-pattern {
          background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z"></path></svg>') no-repeat center;
          background-size: cover;
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
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
