import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const LicensedTherapist: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Become a Licensed Therapist | Unity Consultants</title>
        <meta name="description" content="Join our team of marriage counselors in Ethiopia" />
      </Helmet>

      <div className="bg-[#f9f5ff] p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-[#4b2a75] mb-4">Licensed Therapist Opportunity</h1>
        <p className="text-lg text-gray-700 mb-6">
          Join our network of certified marriage counselors helping Ethiopian couples build stronger relationships.
        </p>
        <Link 
          to="/signup" 
          className="bg-[#4b2a75] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3a1d5a] transition"
        >
          Apply Now →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Your Role</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Provide culturally-sensitive marriage counseling sessions</li>
            <li>Conduct virtual and in-person therapy (when available)</li>
            <li>Develop personalized relationship improvement plans</li>
            <li>Participate in monthly professional development workshops</li>
            <li>Maintain confidential case records</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Master's degree in Psychology, Counseling, or related field</li>
            <li>Valid Ethiopian counseling license (or eligibility)</li>
            <li>2+ years experience in couples therapy</li>
            <li>Understanding of Ethiopian cultural and religious contexts</li>
            <li>Fluency in Amharic and English (other local languages a plus)</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Why Join Us?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-l-4 border-[#4b2a75] pl-4">
            <h3 className="font-medium mb-2">Flexible Schedule</h3>
            <p className="text-gray-600">Set your own hours and work remotely</p>
          </div>
          <div className="border-l-4 border-[#4b2a75] pl-4">
            <h3 className="font-medium mb-2">Competitive Compensation</h3>
            <p className="text-gray-600">Earn while making a difference</p>
          </div>
          <div className="border-l-4 border-[#4b2a75] pl-4">
            <h3 className="font-medium mb-2">Cultural Impact</h3>
            <p className="text-gray-600">Strengthen Ethiopian families</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/careers" className="text-[#4b2a75] hover:underline flex items-center">
          ← View all career opportunities
        </Link>
      </div>
    </div>
  );
};

export default LicensedTherapist;