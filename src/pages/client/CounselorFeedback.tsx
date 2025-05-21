import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';

const CounselorFeedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement feedback submission logic
    console.log({ rating, feedback });
    // Reset form
    setRating(0);
    setFeedback('');
  };

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

      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#4b2a75] mb-6">Rate Your Experience</h1>
          <p className="text-gray-600 mb-8">
            We highly value your feedback! Kindly take a moment to rate your experience and provide us with your valuable feedback.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:border-transparent"
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-40 bg-[#4b2a75] text-white py-2 px-4 rounded-md hover:bg-[#3a2057] transition-colors duration-200 align-item-center"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounselorFeedback;