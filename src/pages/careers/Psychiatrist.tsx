import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Psychiatrist: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Psychiatrist Position | Unity Consultants</title>
        <meta name="description" content="Psychiatrist opportunity for couples counseling in Ethiopia" />
      </Helmet>

      <div className="bg-[#f9f5ff] p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-[#4b2a75] mb-4">Psychiatrist Opportunity</h1>
        <p className="text-lg text-gray-700 mb-6">
          Help Ethiopian couples address mental health challenges within their relationships.
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
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Your Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Diagnose and treat mental health conditions affecting relationships</li>
            <li>Collaborate with marriage counselors on complex cases</li>
            <li>Provide medication management when appropriate</li>
            <li>Educate couples about mental health and relationships</li>
            <li>Participate in our mental health awareness programs</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Qualifications</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Medical degree with specialization in Psychiatry</li>
            <li>Valid license to practice in Ethiopia</li>
            <li>Experience with couples or family therapy</li>
            <li>Understanding of Ethiopian mental health stigma challenges</li>
            <li>Comfort with telemedicine platforms</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Our Support</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Clinical Team</h3>
            <p className="text-gray-600 mb-4">
              Work alongside experienced marriage counselors and social workers in a collaborative environment.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Resources</h3>
            <p className="text-gray-600">
              Access to our platform's tools and Ethiopian-specific mental health resources.
            </p>
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

export default Psychiatrist;