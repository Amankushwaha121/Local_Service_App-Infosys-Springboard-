import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceDetail = ({ service }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();

  if (!service) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Service not found. Please go back and select a service.</p>
      </div>
    );
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time for booking.');
      return;
    }
    
    // In a real app, you would pass booking details to the booking page
    navigate('/booking', { 
      state: { 
        service, 
        date: selectedDate, 
        time: selectedTime 
      } 
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`, `${hour}:30`);
    }
    return slots;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <h1 className="text-3xl font-bold">{service.name}</h1>
        <div className="flex items-center mt-2">
          <span className="bg-white text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {service.serviceType}
          </span>
          <div className="ml-4 flex items-center">
            <span className="text-yellow-300 text-xl">⭐</span>
            <span className="ml-1">{service.rating} ({service.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Service Description</h2>
              <p className="text-gray-600">{service.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Service Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Experience</h3>
                  <p className="text-gray-600">{service.experience}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Service Cost</h3>
                  <p className="text-gray-600">{service.cost}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Availability</h3>
                  <p className="text-gray-600">{service.availability}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600">{service.location}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Reviews & Ratings</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="text-2xl text-yellow-500">⭐</div>
                  <span className="ml-2 text-xl font-semibold">{service.rating}/5</span>
                  <span className="ml-2 text-gray-600">({service.reviews} reviews)</span>
                </div>
                <p className="text-gray-600">Excellent service quality based on customer feedback</p>
              </div>
            </section>
          </div>

          {/* Booking Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Book This Service</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a time</option>
                  {generateTimeSlots().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-700 mb-2">Booking Summary</h3>
                <p className="text-gray-600">Service: {service.name}</p>
                <p className="text-gray-600">Cost: {service.cost}</p>
                {selectedDate && <p className="text-gray-600">Date: {selectedDate}</p>}
                {selectedTime && <p className="text-gray-600">Time: {selectedTime}</p>}
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition-colors font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
