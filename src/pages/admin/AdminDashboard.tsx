import React, { useState, FormEvent, ChangeEvent } from "react";

const stats: { label: string; value: number }[] = [
  { label: "Total clients", value: 450 },
  { label: "counselors", value: 20 },
  { label: "completed sessions", value: 13 },
  { label: "scheduled sessions", value: 33 },
];

const notifications: string[] = [
  `hello abebe, here is your session link join and build a healthy relationship.
https://www.figma.com/design/YpkWqfhdtuL1BYgahEtIBm5J/Unity-consultancy?node-id=359-48&t-qMHEhImYNMgVKiAR-0`,
  "New Session Booked: Client Melos has scheduled a session for April 6 at 2:00 PM.",
  "You have a session with Counselor Helen tomorrow at 10:00 AM.",
  "lorem ipsum",
  "hello , counselor you have registered successfully!!",
];

export default function AdminDashboard(): JSX.Element {
  const [notifInput, setNotifInput] = useState<string>("");
  const [notifTo, setNotifTo] = useState<string>("");

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add send logic here
    setNotifInput("");
    setNotifTo("");
  };

  return (
    <div className="min-h-screen bg-[#ece6fa] flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#f5f4fa] border-b border-[#e0d7f3] flex items-center justify-between px-8 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ede7fa]">
            {/* Logo SVG */}
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#dfd6f9" />
              <text
                x="16"
                y="21"
                textAnchor="middle"
                fontSize="18"
                fill="#6C4AB6"
                fontFamily="Arial"
              >
                🧠
              </text>
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-gray-500 text-sm">counselor posts</span>
          <button className="border border-purple-400 rounded-md px-4 py-1 text-purple-700 text-sm hover:bg-purple-50 transition">
            logout
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="10" r="3" fill="currentColor" />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M12 13c-3 0-5 1.5-5 3.5V18h10v-1.5c0-2-2-3.5-5-3.5z"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[320px] bg-[#ece6fa] border-r border-[#e0d7f3] pt-10 px-8">
          <h2 className="text-2xl font-semibold text-[#4b358a] mb-10">Admin Dashboard</h2>
          <nav className="flex flex-col gap-0">
            <button className="text-left px-4 py-4 bg-[#ded6fa] text-[#4b358a] font-medium border-b border-[#bdb6d3]">
              Home
            </button>
            <button className="text-left px-4 py-4 text-[#4b358a] border-b border-[#bdb6d3]">
              Manage Users
            </button>
            <button className="text-left px-4 py-4 text-[#4b358a] border-b border-[#bdb6d3]">
              Manage Counselors
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-row px-8 py-12 gap-8">
          {/* Center Dashboard */}
          <section className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-[#392c6c] mb-12">Welcome, Admin!</h1>
            <div className="grid grid-cols-2 gap-8 w-[480px]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#e3e0e9] rounded-xl flex flex-col items-center justify-center h-40"
                >
                  <span className="text-4xl text-[#6c6c6c] font-light mb-2">{stat.value}</span>
                  <span className="text-lg text-[#888]">{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications Panel */}
          <aside className="w-[400px] bg-[#e3eafd] rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#392c6c]">Notifications</h2>
              <span className="text-[#392c6c] text-lg">
                <svg
                  className="inline w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0
                     .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6
                      0v-1m6 0H9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-2 mb-4 overflow-y-auto">
              {notifications.map((msg, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-md px-3 py-2 text-sm text-[#22223b] shadow-sm"
                >
                  {msg}
                </div>
              ))}
            </div>
            <form
              className="bg-white rounded-md p-3 flex flex-col gap-2 shadow"
              onSubmit={handleSend}
            >
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-200"
                rows={2}
                placeholder="Send a Notification ..."
                value={notifInput}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotifInput(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="To"
                  value={notifTo}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNotifTo(e.target.value)}
                />
                <button
                  type="submit"
                  className="ml-auto text-purple-700 hover:text-purple-900 p-2 rounded-full transition"
                  title="Send"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.94 17.94a1.5 1.5 0 002.12 0l12-12a1.5 1.5 0 00-2.12-2.12l-12 12a1.5 1.5 0 000 2.12z" />
                  </svg>
                </button>
              </div>
            </form>
          </aside>
        </main>
      </div>
    </div>
  );
}
