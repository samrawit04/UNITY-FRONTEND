import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const TermsOfUse: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-700">
      <Helmet>
        <title>Unity Consultants - Terms of Use</title>
        <meta name="description" content="Terms governing the use of Unity Consultants' marriage counseling platform" />
      </Helmet>

      <h1 className="text-3xl font-bold text-[#4b2a75] mb-6">Terms of Use</h1>
      <p className="text-sm mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-[#4b2a75]">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using <strong>Unity Consultants</strong> ("Platform"), you agree to comply with these Terms of Use. 
          If you do not agree, you must discontinue use immediately.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-[#4b2a75]">2. Service Description</h2>
        <p className="mb-2">
          Unity Consultants provides an online platform connecting users with licensed marriage counselors, 
          psychologists, and religious advisors in Ethiopia. Services include:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Booking consultations</li>
          <li>Secure video/audio sessions</li>
          <li>Payment processing</li>
          <li>Educational resources</li>
        </ul>
      </section>

      {/* Additional sections... */}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-[#4b2a75]">8. Governing Law</h2>
        <p>
          These terms are governed by <strong>Ethiopian law</strong>. Disputes shall be resolved in Addis Ababa courts.
        </p>
      </section>

      <div className="border-t pt-6 mt-6">
        <Link to="/signup" className="text-[#4b2a75] hover:underline">
          ← Back to SignUp
        </Link>
      </div>
    </div>
  );
};

export default TermsOfUse;