// src/pages/CounselorDashboard.tsx
import React, { useState, useRef, useEffect } from "react";
import { IconBell, IconUser, IconLogout, IconVideo, IconMail } from "@tabler/icons-react";

const token = localStorage.getItem("token");
console.log("Token:", token);

const notifications = [
  "hello abebe, here is your session link join and build a healthy relationship. https://www.figma.com/design/YpkWqfhduL1BYgah1EiBm5/Unity-consultancy?node-id=359-4&t=qMHEhMYNMgVKi aR-0",
  "New Session Booked: Client Melos has scheduled a session for April 6 at 2:00 PM.",
  "You have a session with Counselor Helen tomorrow at 10:00 AM.",
  "lorem ipsum",
  "hello , counselor you have registered successfully!!",
];

const sessions = [
  {
    title: "Pre-Marital Guidance Session",
    date: "12/03/2018",
    time: "2:00pm LT",
    client: "MELOS WERKUK",
  },
  {
    title: "Conflict Resolution",
    date: "12/03/2018",
    time: "2:00pm LT",
    client: "MELOS WERKUK",
  },
  {
    title: "Conflict Resolution",
    date: "12/03/2018",
    time: "2:00pm LT",
    client: "MELOS WERKUK",
  },
];

const clients = [
  { name: "Abebe kebede" },
  { name: "Abebe kebede" },
  { name: "Abebe kebede" },
  { name: "Abebe kebede" },
  { name: "Abebe kebede" },
  { name: "Abebe kebede" },
];

function NotificationCard({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [to, setTo] = useState("");

  if (!show) return null;

  return (
    <div className="fixed top-20 right-8 w-80 bg-white rounded-2xl shadow-lg p-6 z-50 flex flex-col gap-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
          Notifications <IconBell size={20} />
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-purple-600">&times;</button>
      </div>
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {notifications.map((text, i) => (
          <div key={i} className="bg-gray-100 rounded px-3 py-2 text-sm">{text}</div>
        ))}
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Send a Notification to your Client ...."
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={to}
            onChange={e => setTo(e.target.value)}
          >
            <option value="">To</option>
            {clients.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition"
            onClick={() => {
              if (message) alert(`Notification sent to ${to || "all"}: ${message}`);
              setMessage("");
              setTo("");
            }}
          >
            <IconMail size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CounselorDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-white flex items-center justify-between px-8 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="../../asset/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-purple-200" />
        </div>
        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          <li className="hover:text-purple-700 cursor-pointer">Home</li>
          <li className="hover:text-purple-700 cursor-pointer">clients</li>
          <li className="hover:text-purple-700 cursor-pointer">Posts</li>
          <li>
            <button
              onClick={() => setShowNotifications((s) => !s)}
              className="relative text-gray-600 hover:text-purple-700"
              aria-label="Show notifications"
            >
              <IconBell size={26} />
            </button>
          </li>
          <li>
            <button className="hover:bg-purple-100 p-2 rounded-full transition">
              <IconVideo size={26} />
            </button>
          </li>
          <li>
            <button className="hover:bg-purple-100 p-2 rounded-full transition">
              <IconLogout size={26} />
            </button>
          </li>
          <li>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <IconUser size={28} className="text-gray-400" />
            </div>
          </li>
        </ul>
      </nav>

      {/* Notification Card */}
      <NotificationCard show={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Dashboard Main */}
      <main className="max-w-4xl mt-10 bg-purple-100 rounded-2xl p-8 shadow min-h-[600px]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            welcome Abebe, Thank you for being here!
          </h1>
        
          <button className="bg-purple-400 hover:bg-purple-500 text-white font-semibold px-8 py-2 rounded-lg transition mb-6">
            Job Application
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-purple-800">UP COMING SESSIONS</h2>
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {sessions.map((s, i) => (
              <div key={i} className="min-w-[240px] bg-white rounded-xl p-5 border flex flex-col text-center shadow-sm">
                <div className="font-semibold mb-2">{s.title}</div>
                <div className="text-gray-600">Date: {s.date}</div>
                <div className="text-gray-600">Time: {s.time}</div>
                <div className="text-gray-600">Client: {s.client}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-purple-800">Your Clients</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {clients.map((c, i) => (
              <div key={i} className="flex flex-col items-center bg-white rounded-xl p-4 w-32 border shadow-sm">
                <div className="bg-gray-200 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <IconUser size={32} className="text-gray-400" />
                </div>
                <span className="text-sm font-medium">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
