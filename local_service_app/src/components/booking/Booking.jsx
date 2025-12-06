import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentModal from "../payment/PaymentModal";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, date, time } = location.state || {};

  const [bookingDetails, setBookingDetails] = useState({
    specialInstructions: "",
    contactPhone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  // ⭐ Correct dynamic cost
  const totalAmount =
    service?.cost ??
    service?.provider?.cost ??
    0;

  const handleConfirmBooking = async () => {
    if (!bookingDetails.contactPhone || !bookingDetails.address) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser?.id) {
        navigate("/login");
        return;
      }

      const providerId =
        service?.provider?.id ||
        service?.providerId ||
        null;

      const bookingRequest = {
        userId: currentUser.id,
        serviceId: service.id,
        providerId: providerId,
        date,
        time,
        specialInstructions: bookingDetails.specialInstructions,
        contactPhone: bookingDetails.contactPhone,
        address: bookingDetails.address,
      };

      const response = await axios.post(
        "http://localhost:8080/api/bookings/create",
        bookingRequest
      );

      if (response.data?.success) {
        setCreatedBooking({
          ...response.data.data,
          service,
          amount: totalAmount,
        });
        setShowPayment(true);
      } else {
        alert("Booking failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!service) {
    return <div>No service selected.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary p-4">
        <h1 className="text-3xl text-blue-700 font-bold">Confirm Your Booking</h1>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
            <p className="text-gray-600">{service.serviceType} Service</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Service Cost:</span>
              <span className="font-semibold">${totalAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Date:</span> <span>{date}</span>
            </div>

            <div className="flex justify-between">
              <span>Time:</span> <span>{time}</span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>

          <div className="space-y-4">
            <input
              type="tel"
              name="contactPhone"
              value={bookingDetails.contactPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter phone number"
            />

            <textarea
              name="address"
              value={bookingDetails.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter service address"
              rows="3"
            />

            <textarea
              name="specialInstructions"
              value={bookingDetails.specialInstructions}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Special instructions"
              rows="3"
            />
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg"
            >
              {loading ? "Creating..." : "Confirm Booking"}
            </button>

            <button
              onClick={handleCancel}
              className="w-full bg-red-500 text-white py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        open={showPayment}
        booking={createdBooking}
        totalAmount={totalAmount}
        onClose={() => setShowPayment(false)}
        onSuccess={() => navigate("/booking-status")}
      />
    </div>
  );
};

export default Booking;

