import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, date, time } = location.state || {};
  
  const [bookingDetails, setBookingDetails] = useState({
    specialInstructions: '',
    contactPhone: '',
    address: ''
  });

  const handleChange = (e) => {
    setBookingDetails({
      ...bookingDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = () => {
    if (!bookingDetails.contactPhone || !bookingDetails.address) {
      alert('Please fill in all required fields.');
      return;
    }

    // In a real app, you would make an API call to create the booking
    const booking = {
      id: Date.now(),
      service,
      date,
      time,
      ...bookingDetails,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };

    // Store booking in localStorage for demo purposes
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));

    navigate('/booking-status');
  };

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">No Service Selected</h2>
        <p className="text-gray-600 mb-4">Please go back and select a service to book.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          Find Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary text-white p-6">
        <h1 className="text-3xl font-bold">Confirm Your Booking</h1>
        <p className="mt-2">Please review and confirm your booking details</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Summary</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
              <p className="text-gray-600 capitalize">{service.serviceType} Service</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Cost:</span>
                <span className="font-semibold">{service.cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{time}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{service.cost}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={bookingDetails.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Address *
                </label>
                <textarea
                  name="address"
                  value={bookingDetails.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter the address where service is needed"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={bookingDetails.specialInstructions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special requirements or instructions..."
                  rows="3"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={handleConfirmBooking}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Confirm Booking
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;