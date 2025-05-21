import React from 'react';
import { Button } from '@/components/ui/button';
import { IconBell, IconUser } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const upcomingSessions = [
    {
      id: 1,
      type: 'Pre-Marital Guidance Session',
      date: '12/03/2018',
      time: '2:00pm LT',
      counselor: 'MELOS WERKUK'
    },
    {
      id: 2,
      type: 'Pre-Marital Guidance Session',
      date: '12/03/2025',
      time: '2:00pm LT',
      counselor: 'MELOS WERKUK'
    }
  ];

  const notifications = [
    {
      id: 1,
      message: 'hello abebe, here is your session link join and build a healthy relationship.',
      link: 'session link'
    },
    {
      id: 2,
      message: 'You have a session with Counselor Helen today at 10:00 AM get ready.'
    },
    {
      id: 3,
      message: 'You have a session with Counselor Helen tomorrow at 10:00 AM.'
    },
    {
      id: 4,
      message: 'hello, abebe you have registered successfully!!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Link to="/counselor-posts" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">
              Counselor Posts
            </Link>
            <Link to="/logout" className="text-[#4b2a75] hover:text-[#3a2057] font-medium">Logout</Link>

            <Link to="/profile" className="text-[#4b2a75] hover:text-[#3a2057]">
              <IconUser size={24} />
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#4b2a75] mb-2">welcome Abebe, we're here for you!</h1>
              <p className="text-gray-600">You're one step closer to building a healthier and happier relationship.</p>
            </div>
            <Link to="/book-session">
              <Button className="bg-[#4b2a75] hover:bg-[#3a2057] text-white px-8 py-3 rounded-lg text-base font-semibold">
                Book a session
              </Button>
            </Link>
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-[#4b2a75] mb-6">UP COMING SESSIONS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-4">{session.type}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Date: {session.date}</p>
                      <p>Time: {session.time}</p>
                      <p>COUNSELOR: {session.counselor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Notifications Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#4b2a75]">Notifications</h2>
              <IconBell className="text-[#4b2a75]" />
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  {notification.link && (
                    <a href="#" className="text-sm text-[#4b2a75] hover:underline mt-2 block">
                      {notification.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;