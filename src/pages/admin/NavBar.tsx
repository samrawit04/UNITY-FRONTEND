import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  onLogout: () => void;
  onProfileClick: () => void;
  onCounselorPostsClick: () => void;
  notificationCount?: number;
}

export const NavBar: React.FC<NavBarProps> = ({
  onLogout,
  notificationCount = 0,
  onProfileClick,
  onCounselorPostsClick,
}) => (
  <nav className="flex items-center justify-between bg-gray-50 px-8 py-3 shadow-sm w-full">
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <img
          src="/src/asset/logo.png"
          alt="Unity Logo"
          className="h-8 w-auto"
        />
      </Link>
    </div>
    <div className="flex items-center gap-6">
      <button
        onClick={onCounselorPostsClick}
        className="text-purple-600 hover:text-purple-700 cursor-pointer"
      >
        counselor posts
      </button>
      <button
        onClick={onLogout}
        className="border border-purple-400 bg-transparent text-purple-400 rounded-lg px-4 py-1.5 cursor-pointer hover:bg-purple-50"
      >
        logout
      </button>
      <div className="relative cursor-pointer">
        <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24">
          <path
            d="M12 22c1.1 0 2-.9 2-2H10a2 2 0 002 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.7 1.7A1 1 0 006 20h12a1 1 0 00.7-1.7L18 16z"
            fill="currentColor"
          />
        </svg>
        {notificationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-purple-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>
      <button onClick={onProfileClick} className="cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-purple-400 relative">
          <div className="absolute w-8 h-8 rounded-full bg-purple-400 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute w-6 h-3 bg-purple-400 opacity-30 rounded-full top-5 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </button>
    </div>
  </nav>
);
