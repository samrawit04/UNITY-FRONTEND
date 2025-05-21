import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';

const BookSession = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Select Your Therapist' },
    { id: 2, title: 'Therapist Availability' },
    { id: 3, title: 'Summary' },
    { id: 4, title: 'Payment' },
    { id: 5, title: 'Confirmation' }  // Added a title for the confirmation step
  ];

  const therapists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      image: 'https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
      specialization: 'Marriage Counselor',
      experience: '10+ years',
      rate: '$100/hour'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
      specialization: 'Pre-Marriage Counselor',
      experience: '8+ years',
      rate: '$90/hour'
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
      specialization: 'Relationship Expert',
      experience: '12+ years',
      rate: '$120/hour'
    }
  ];

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

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* Steps Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'bg-[#4b2a75] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {step.id}
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-600">{step.title}</div>
                  {step.id !== steps.length && (
                    <div className={`w-24 h-1 mx-2 ${currentStep > step.id ? 'bg-[#4b2a75]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#4b2a75] mb-6">Choose Your Therapist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {therapists.map((therapist) => (
                  <div 
                    key={therapist.id} 
                    onClick={() => setSelectedTherapist(therapist)}
                    className={`border rounded-lg p-6 cursor-pointer transition-colors ${selectedTherapist?.id === therapist.id ? 'border-[#4b2a75] bg-[#f5f0ff]' : 'hover:border-[#4b2a75]'}`}
                  >
                    <img src={therapist.image} alt={therapist.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                    <h3 className="text-lg font-semibold text-center mb-2">{therapist.name}</h3>
                    <p className="text-gray-600 text-center mb-1">{therapist.specialization}</p>
                    <p className="text-gray-500 text-center text-sm mb-1">{therapist.experience}</p>
                    <p className="text-[#4b2a75] text-center font-medium">{therapist.rate}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  disabled={currentStep === 1}
                >
                  Back
                </button>
                <button
                  onClick={() => selectedTherapist && setCurrentStep(currentStep + 1)}
                  className="bg-[#4b2a75] text-white px-6 py-2 rounded-md hover:bg-[#3a2057] transition-colors"
                  disabled={currentStep === steps.length || !selectedTherapist}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Placeholder for other steps */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#4b2a75] mb-6">Select Available Time Slot</h2>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Selected Therapist</h3>
                <div className="flex items-center space-x-4 p-4 bg-[#f5f0ff] rounded-lg">
                  <img src={selectedTherapist?.image} alt={selectedTherapist?.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-medium text-[#4b2a75]">{selectedTherapist?.name}</h4>
                    <p className="text-gray-600">{selectedTherapist?.specialization}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Time slots */}
                {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 border rounded-lg transition-colors ${selectedTime === time ? 'border-[#4b2a75] bg-[#f5f0ff]' : 'hover:border-[#4b2a75]'}`}
                  >
                    <div className="text-center">
                      <p className="font-medium text-[#4b2a75]">{time}</p>
                      <p className="text-sm text-gray-600">Available</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className={`bg-[#4b2a75] text-white px-6 py-2 rounded-md hover:bg-[#3a2057] transition-colors ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!selectedTime}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#4b2a75] mb-6">Booking Summary</h2>
              <div className="bg-[#f5f0ff] rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img src={selectedTherapist?.image} alt={selectedTherapist?.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-medium text-[#4b2a75]">{selectedTherapist?.name}</h4>
                    <p className="text-gray-600">{selectedTherapist?.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">April 17, 2024</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">1 hour</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                    <span className="text-gray-600">Session Type</span>
                    <span className="font-medium">Online via Zoom</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Session Fee</span>
                    <span className="font-medium text-[#4b2a75]">{selectedTherapist?.rate}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-[#4b2a75] text-white px-6 py-2 rounded-md hover:bg-[#3a2057] transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-[#4b2a75] mb-6">Payment</h2>
              <div className="bg-[#f5f0ff] rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img src={selectedTherapist?.image} alt={selectedTherapist?.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-medium text-[#4b2a75]">{selectedTherapist?.name}</h4>
                    <p className="text-gray-600">{selectedTherapist?.specialization}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-[#e0d5f5]">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium text-[#4b2a75]">{selectedTherapist?.rate}</span>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2a75]"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2a75]"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2a75]"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b2a75]"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </form>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(currentStep + 1);
                  }}
                  className="bg-[#4b2a75] text-white px-6 py-2 rounded-md hover:bg-[#3a2057] transition-colors"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-[#4b2a75] mb-6">Your session is confirmed 🎉🎉</h2>
              <div className="bg-[#f5f0ff] rounded-lg p-6 mb-8">
                <p className="text-center text-gray-600 mb-4">You've successfully booked a session with counselor {selectedTherapist?.name}. We've sent the session details to your email.</p>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => navigate('/')}
                  className="bg-[#4b2a75] text-white px-6 py-2 rounded-md hover:bg-[#3a2057] transition-colors"
                >
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSession;
