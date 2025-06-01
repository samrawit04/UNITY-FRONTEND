import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const AdministrativeProfessional: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Administrative Roles | Unity Consultants</title>
        <meta name="description" content="Support positions for marriage counseling platform in Ethiopia" />
      </Helmet>

      <div className="bg-[#f9f5ff] p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-[#4b2a75] mb-4">Administrative Professional</h1>
        <p className="text-lg text-gray-700 mb-6">
          Support our counseling team and help Ethiopian couples access vital services.
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
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Position Overview</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Manage client appointments and counselor schedules</li>
            <li>Handle confidential client communications</li>
            <li>Support billing and payment processes</li>
            <li>Maintain organized electronic records</li>
            <li>Assist with platform operations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Ideal Candidate</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>2+ years administrative experience</li>
            <li>Excellent organizational skills</li>
            <li>Discretion with sensitive information</li>
            <li>Tech-savvy with CRM/platform experience</li>
            <li>Fluency in Amharic and English</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Why This Role Matters</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Behind-the-Scenes Impact</h3>
            <p className="text-gray-600">
              Your work enables counselors to focus on helping couples.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Growth Potential</h3>
            <p className="text-gray-600">
              Opportunities to advance in healthcare administration.
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

export default AdministrativeProfessional;