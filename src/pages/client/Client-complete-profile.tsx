import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const ClientProfileNext = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="relative inline-block mx-auto w-full text-center">
          <div className="relative inline-block">
            <img
              src={profileImage || '/placeholder.svg'}
              alt="User Icon"
              className="h-24 w-24 rounded-full cursor-pointer mx-auto"
              onClick={() => document.getElementById('imageUpload').click()}
            />
            <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer" onClick={() => document.getElementById('imageUpload').click()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4b2a75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </div>
          <input
            type="file"
            id="imageUpload"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4b2a75] mb-2">Complete Your Profile</h1>
          <p className="text-gray-500">Add more details to personalize your experience.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <input
              type="text"
              placeholder="Phone number"
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Your Address"
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            >
              <option value="">Preferred payment method</option>
              <option value="credit">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Your bank Account"
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Language spoken"
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              placeholder="Tell us about your self ..."
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
              rows={4}
            />
          </div>
          <div>
            <textarea
              placeholder="Your Specializations..."
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
              rows={4}
            />
          </div>
          <div className="md:col-span-3 flex justify-center">
            <Button className="w-40 bg-[#4b2a75] hover:bg-[#3a2057] text-white py-3 rounded-lg text-base font-semibold">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientProfileNext;