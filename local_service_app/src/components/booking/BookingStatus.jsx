import React, { useState, useEffect } from 'react';

const BookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setShowReview(true);
  };

  const handleReviewSubmit = (reviewData) => {
    // Update booking with review
    const updatedBookings = bookings.map(booking =>
      booking.id === selectedBooking.id
        ? { ...booking, review: reviewData }
        : booking
    );
    
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setShowReview(false);
    setSelectedBooking(null);
  };

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">No Bookings Yet</h2>
        <p className="text-gray-600 mb-6">You haven't made any service bookings yet.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          Find Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary text-white p-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="mt-2">Track and manage your service bookings</p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{booking.service.name}</h3>
                    <p className="text-gray-600 capitalize">{booking.service.serviceType} Service</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-700">Booking Date:</span>
                    <p className="text-gray-600">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Service Date:</span>
                    <p className="text-gray-600">{booking.date}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Service Time:</span>
                    <p className="text-gray-600">{booking.time}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="font-medium text-gray-700">Service Address:</span>
                  <p className="text-gray-600">{booking.address}</p>
                </div>

                {booking.specialInstructions && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">Special Instructions:</span>
                    <p className="text-gray-600">{booking.specialInstructions}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-700">Cost:</span>
                    <span className="ml-2 text-lg font-semibold text-primary">{booking.service.cost}</span>
                  </div>

                  {booking.status === 'completed' && !booking.review && (
                    <button
                      onClick={() => handleReview(booking)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      Rate & Review
                    </button>
                  )}

                  {booking.review && (
                    <div className="text-sm">
                      <span className="text-yellow-500">⭐ {booking.review.rating}/5</span>
                      <p className="text-gray-600">"{booking.review.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && selectedBooking && (
        <Review 
          booking={selectedBooking}
          onSubmit={handleReviewSubmit}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
};

export default BookingStatus;