import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-700">
      <Helmet>
        <title>Unity Consultants - Privacy Policy</title>
        <meta name="description" content="How Unity Consultants protects your personal data" />
      </Helmet>

      <h1 className="text-3xl font-bold text-[#4b2a75] mb-6">Privacy Policy</h1>
      <p className="text-sm mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-[#4b2a75]">1. Information We Collect</h2>
        <h3 className="font-medium mb-2">a. Personal Data:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Names, contact details, age, marital status</li>
          <li>Payment information (processed securely via approved gateways)</li>
          <li>Session notes (encrypted and stored confidentially)</li>
        </ul>
        <h3 className="font-medium mb-2">b. Technical Data:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>IP addresses, device information</li>
          <li>Cookies for platform functionality</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-[#4b2a75]">2. How We Use Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To match users with appropriate counselors</li>
          <li>To process payments</li>
          <li>To improve services (anonymized analytics only)</li>
        </ul>
      </section>

      {/* Additional sections... */}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-[#4b2a75]">8. Contact</h2>
        <p>
          For questions, contact:<br />
          <strong>Email</strong>: etenesh4good@gmail.com<br />
         <strong>Address:</strong> 4 Kilo, Addis Ababa, Ethiopia

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

export default PrivacyPolicy;