import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import Navbar from '@/components/Navbar';

const CounselorProfile = () => {
  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <Link to="/counselor-dashboard" className="inline-flex items-center text-[#4b2a75] hover:text-[#3a2057] mb-6">
          <IconArrowLeft size={20} className="mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-[#4b2a75] mb-8 text-center">Counselor Profile</h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3 relative">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
                alt="Counselor"
                className="w-full h-auto rounded-lg shadow-sm object-cover aspect-[3/4]"
              />
              <div className="mt-6">
                <button className="w-full bg-[#4b2a75] text-white py-3 px-4 rounded-md hover:bg-[#3a2057] transition-colors duration-200 text-lg font-semibold">
                  Book Now
                </button>
              </div>
            </div>

            <div className="md:col-span-4 bg-white rounded-lg shadow-sm p-6">
              <div>
                <h1 className="text-3xl font-bold text-[#4b2a75] mb-2">Dr. Sarah Johnson</h1>
                <p className="text-gray-600 mb-4">Licensed Clinical Psychologist</p>
                <h2 className="text-xl font-semibold text-[#4b2a75] mb-3">About Me</h2>
                <p className="text-gray-700">
                  I am a licensed clinical psychologist with over 10 years of experience in counseling
                  and therapy. My approach combines cognitive-behavioral therapy with mindfulness
                  techniques to help clients overcome challenges and achieve their personal goals.
                </p>
              </div>
            </div>

            <div className="md:col-span-5 bg-white rounded-lg shadow-sm p-6">
              <div>
                <h2 className="text-xl font-semibold text-[#4b2a75] mb-3">Qualifications</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Ph.D. in Clinical Psychology from Stanford University</li>
                  <li>Licensed Clinical Psychologist (License #12345)</li>
                  <li>Certified in Cognitive Behavioral Therapy</li>
                  <li>Member of the American Psychological Association</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorProfile;