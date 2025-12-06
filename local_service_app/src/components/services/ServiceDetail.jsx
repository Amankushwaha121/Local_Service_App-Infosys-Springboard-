import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceDetail = ({ service }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();

  console.log("RAW SERVICE RECEIVED IN DETAIL:", service);

  // ⭐ Correct dynamic values from provider_service
  const displayName =
    service?.name ||
    service?.provider?.name ||
    "Service";

  const displayType =
    service?.serviceType ||
    service?.provider?.serviceType ||
    "General";

  const displayCost =
    service?.cost ??
    service?.provider?.cost ??
    0;

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

    // ⭐ Passing corrected values to booking page
    const bookingService = {
      ...service,
      name: displayName,
      serviceType: displayType,
      cost: displayCost,
      providerId: service?.provider?.id
    };

    navigate('/booking', {
      state: {
        service: bookingService,
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
    <div className="max-w-4xl mx-auto rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-6">
        <h1 className="text-3xl font-bold text-blue-800">{displayName}</h1>
        <div className="flex items-center mt-2">
          <span className="text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {displayType}
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
                  <p className="text-gray-600">${displayCost}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a time</option>
                  {generateTimeSlots().map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-700 mb-2">Booking Summary</h3>
                <p className="text-gray-600">Service: {displayName}</p>
                <p className="text-gray-600">Cost: ${displayCost}</p>
                {selectedDate && <p className="text-gray-600">Date: {selectedDate}</p>}
                {selectedTime && <p className="text-gray-600">Time: {selectedTime}</p>}
              </div>

              <button
                onClick={handleBooking}
               class="w-full bg-primary bg-blue-700 text-xl text-white py-3 rounded-xl font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 active:scale-95">
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
