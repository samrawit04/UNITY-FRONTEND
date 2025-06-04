import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoClose, IoMenu } from 'react-icons/io5';
import defaultUser from '../../../asset/userDefault.png';

interface MyJwtPayload {
  id: string;
  email: string;
  [key: string]: any;
}

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Profile {
  profilePicture?: string;
  user?: { firstName: string };
}

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode<MyJwtPayload>(token);
    const userId = decoded.id;

    axios
      .get(`http://localhost:3000/clients/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error('Failed to fetch profile', err));
  }, []);

  // Fetch notifications
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode<MyJwtPayload>(token);
    const userId = decoded.id;

    const fetchAllNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/notifications?role=CLIENT&userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = res.data;
        setNotifications(all);
        setNotificationCount(all.filter((n: Notification) => !n.isRead).length);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchAllNotifications();
    const interval = setInterval(fetchAllNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  // Mark notifications as read
  useEffect(() => {
    if (!showNotifications || notificationCount === 0) return;

    const markAsRead = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `http://localhost:3000/notifications/mark-read`,
          { userId: jwtDecode<MyJwtPayload>(token!).id, role: 'CLIENT' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setNotificationCount(0);
      } catch (err) {
        console.error('Failed to mark notifications as read', err);
      }
    };

    markAsRead();
  }, [showNotifications, notificationCount]);

  // Close notification card on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notification Bell Component
  const NotificationBell = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="relative focus:outline-none" aria-label="Notifications">
      <svg
        className="w-7 h-7 text-gray-700 hover:text-purple-700 transition"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {notificationCount > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </button>
  );

  // Notification Card Component
  const NotificationCard = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return (
      <div
        ref={cardRef}
        className="absolute right-4 top-16 w-80 sm:w-96 bg-white rounded-xl shadow-lg p-5 z-50 border border-gray-200 flex flex-col"
      >
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          Notifications <span role="img">🔔</span>
        </h2>
        <div className="space-y-2 max-h-52 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications yet.</p>
          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                className={`rounded p-3 text-sm ${note.isRead ? 'bg-gray-100' : 'bg-purple-100 font-semibold'}`}
              >
                {note.message}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 sm:px-8 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/src/asset/logo.png" alt="Unity Logo" className="h-10" />
        </Link>

        {/* Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <li className="hover:text-purple-700 cursor-pointer" onClick={() => navigate('/client-dashboard')}>
            Dashboard
          </li>
          <li className="hover:text-purple-700 cursor-pointer" onClick={() => navigate('/counselor-posts')}>
            Counselor Posts
          </li>
          <li className="hover:text-purple-700 cursor-pointer" onClick={() => navigate('/')}>
            Logout
          </li>
          <li>
            <NotificationBell onClick={() => setShowNotifications((s) => !s)} />
          </li>
          <li onClick={() => navigate('/client-complete-profile')} className="cursor-pointer">
            {profile?.profilePicture ? (
              <img
                src={`http://localhost:3000/uploads/profile-pictures/${profile.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-lg uppercase">
                {profile?.user?.firstName?.charAt(0) || 'U'}
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <div className="flex flex-col items-start gap-3 text-gray-700 font-medium">
            <button onClick={() => navigate('/client-dashboard')}>Dashboard</button>
            <button onClick={() => navigate('/counselor-posts')}>Counselor Posts</button>
            <button onClick={() => navigate('/')}>Logout</button>
            <NotificationBell onClick={() => setShowNotifications((s) => !s)} />
            <div onClick={() => navigate('/client-complete-profile')}>
              {profile?.profilePicture ? (
                <img
                  src={`http://localhost:3000/uploads/profile-pictures/${profile.profilePicture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border object-cover mt-2"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-lg uppercase">
                  {profile?.user?.firstName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <NotificationCard show={showNotifications} />
    </nav>
  );
};

export default Navbar;