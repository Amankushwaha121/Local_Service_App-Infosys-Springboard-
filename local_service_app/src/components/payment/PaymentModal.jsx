import React, { useState } from "react";
import axios from "axios";

const PaymentModal = ({ open, booking, totalAmount, onClose, onSuccess }) => {
  if (!open || !booking) return null;

  const amount =
    totalAmount ??
    booking.amount ??
    booking.service?.cost ??
    booking.service?.provider?.cost ??
    0;

  const [method, setMethod] = useState("CARD");
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState("Google Pay");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(""); 
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    try {
      const payload = {
        amount,
        method,
        upiId: method === "UPI" ? upiId : null,
        upiApp: method === "UPI" ? upiApp : null, // ⭐ added
        cardLast4:
          method === "CARD" && cardNumber.length >= 4
            ? cardNumber.slice(-4)
            : null,
        cardName: method === "CARD" ? cardName : null, // ⭐ added
      };

      const res = await axios.post(
        `http://localhost:8080/api/payments/pay/${booking.id}`,
        payload
      );

      if (res.data.success) {
        alert("Payment successful!");
        onSuccess && onSuccess();
      } else {
        alert("Payment failed!");
      }
    } catch (err) {
      alert("Payment error!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-xl font-bold mb-3">Razorpay (Dummy)</h2>

        <div className="mb-4 border-t pt-4">
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-bold text-lg">₹{amount}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block mb-1">Payment Method</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMethod("CARD")}
              className={`flex-1 px-3 py-2 rounded-lg border ${
                method === "CARD"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Card
            </button>

            <button
              onClick={() => setMethod("UPI")}
              className={`flex-1 px-3 py-2 rounded-lg border ${
                method === "UPI"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              UPI
            </button>
          </div>
        </div>

        {/* ⭐ CARD FIELDS */}
        {method === "CARD" && (
          <div className="space-y-2">

            <input
              type="text"
              placeholder="Card Holder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              type="text"
              placeholder="Card number (dummy)"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />

          </div>
        )}

        {/* ⭐ UPI FIELDS */}
        {method === "UPI" && (
          <div className="space-y-3 mb-4">

            <input
              type="text"
              placeholder="UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />

            {/* ⭐ UPI App Dropdown */}
            <select
              value={upiApp}
              onChange={(e) => setUpiApp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option>Google Pay</option>
              <option>PhonePe</option>
              <option>Paytm</option>
              <option>Bhim UPI</option>
            </select>

          </div>
        )}

        <button
          disabled={processing}
          onClick={handlePay}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3"
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;

