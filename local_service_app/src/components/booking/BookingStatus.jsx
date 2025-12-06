import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) return;

      const user = JSON.parse(userRaw);
      const userId = user.id;

      const resp = await axios.get(
        `http://localhost:8080/api/bookings/user/${userId}`
      );

      let data = [];

      if (resp.data?.success && Array.isArray(resp.data.data)) {
        data = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        data = resp.data;
      }

      const formatted = data.map((b) => {
        // 👉 sabse pehle provider_service se hourlyRate nikaal rahe hain
        const providerHourlyRate =
          b.providerService?.hourlyRate ??
          b.providerService?.hourly_rate ??
          b.provider_service?.hourlyRate ??
          b.provider_service?.hourly_rate ??
          b.service?.hourlyRate ??
          b.service?.hourly_rate ??
          b.provider?.hourlyRate ??
          b.provider?.hourly_rate ??
          null;

        // final amount: pehle hourlyRate (provider_service se), phir fallback
        const totalAmount =
          providerHourlyRate ??
          b.amount ??
          b.totalAmount ??
          b.price ??
          b.finalAmount ??
          b.bookingCost ??
          b.service?.cost ??
          b.provider?.cost ??
          0;

        return {
          ...b,
          totalAmount,
          service: {
            name:
              b.service?.name ||
              b.provider?.name ||
              "Service",
            serviceType:
              b.service?.serviceType ||
              b.provider?.serviceType ||
              "General",
            // yahi cost UI me dikhaya jaayega
            cost: totalAmount,
          },
        };
      });

      setBookings(formatted);
    } catch (err) {
      console.error("Error loading bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toUpperCase()) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
      case "IN-PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setShowReview(true);
  };

  const handleReviewSubmit = (reviewData) => {
    const updated = bookings.map((b) =>
      b.id === selectedBooking.id ? { ...b, review: reviewData } : b
    );
    setBookings(updated);
    setShowReview(false);
  };

  if (!loading && bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">No Bookings Yet</h2>
        <p className="text-gray-600 mb-6">
          You haven't made any service bookings yet.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
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
        <div className="bg-primary p-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="mt-2">Track and manage your service bookings</p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {booking.service?.name}
                    </h3>
                    <p className="text-gray-600 capitalize">
                      {booking.service?.serviceType} Service
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status &&
                      booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Booking Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-700">Booking Date:</span>
                    <p className="text-gray-600">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : ""}
                    </p>
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

                {/* Address */}
                <div className="mb-4">
                  <span className="font-medium text-gray-700">Service Address:</span>
                  <p className="text-gray-600">{booking.address}</p>
                </div>

                {/* Special Instructions */}
                {booking.specialInstructions && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">
                      Special Instructions:
                    </span>
                    <p className="text-gray-600">{booking.specialInstructions}</p>
                  </div>
                )}

                {/* Cost + Review */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-700">Cost:</span>
                    <span className="ml-2 text-lg font-semibold text-primary">
                      ${booking.service?.cost}
                    </span>
                  </div>

                  {booking.status?.toUpperCase() === "COMPLETED" &&
                    !booking.review && (
                      <button
                        onClick={() => handleReview(booking)}
                        className="bg-primary px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        Rate & Review
                      </button>
                    )}

                  {booking.review && (
                    <div className="text-sm">
                      <span className="text-yellow-500">
                        ⭐ {booking.review.rating}/5
                      </span>
                      <p className="text-gray-600">"{booking.review.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReview && selectedBooking && <div>Your Review Modal Here</div>}
    </div>
  );
};

export default BookingStatus;
