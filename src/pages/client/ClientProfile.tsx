import React from 'react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

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
      <div className="max-w-md w-full space-y-8 item-center">
      <div className="relative inline-block">
            <div className="relative">
              <img
                src={profileImage || '/public/placeholder.svg'}
                alt="User Icon"
                className="h-24 w-24 rounded-full cursor-pointer mx-auto"
                onClick={() => document.getElementById('imageUpload').click()}
              />
              <span className="absolute bottom-0 right-0 bg-white rounded-full p-1" onClick={() => document.getElementById('imageUpload').click()}>
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
        <form className="space-y-6">
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
            <input
              type="date"
              placeholder="Date of birth"
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            >
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2a75] focus:bg-white transition-colors"
            >
              <option>Marital Status</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
            </select>
          </div>
          <Button className="w-40 bg-[#4b2a75] item-center hover:bg-[#3a2057] text-white py-3 rounded-lg text-base font-semibold" onClick={() => navigate('/client-profile-next')}>
            Next
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClientProfile;