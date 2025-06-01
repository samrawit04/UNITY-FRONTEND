import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const ClinicalSocialWorker: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Clinical Social Worker | Unity Consultants</title>
        <meta name="description" content="Social work position for marriage support in Ethiopia" />
      </Helmet>

      <div className="bg-[#f9f5ff] p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-[#4b2a75] mb-4">Clinical Social Worker</h1>
        <p className="text-lg text-gray-700 mb-6">
          Provide essential social support to Ethiopian couples facing relationship challenges.
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
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Key Duties</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Assess social factors impacting couples' relationships</li>
            <li>Connect clients with community resources</li>
            <li>Address domestic challenges and family dynamics</li>
            <li>Provide crisis intervention when needed</li>
            <li>Document cases and maintain records</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Bachelor's or Master's in Social Work</li>
            <li>Clinical social work certification</li>
            <li>Experience with family/couples services</li>
            <li>Knowledge of Ethiopian social services</li>
            <li>Excellent communication skills</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4b2a75] mb-4">Work Environment</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Flexible Options</h3>
            <p className="text-gray-600">Choose between full-time, part-time, or project-based work</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Community Focus</h3>
            <p className="text-gray-600">Make a direct impact in Ethiopian communities</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Professional Growth</h3>
            <p className="text-gray-600">Regular training on Ethiopian marriage dynamics</p>
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

export default ClinicalSocialWorker;