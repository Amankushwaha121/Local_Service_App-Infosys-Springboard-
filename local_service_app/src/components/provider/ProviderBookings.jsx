import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProviderBookings = ({ provider }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (provider) {
      fetchBookings();
    }
  }, [provider]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const pid = provider?.id || provider?.providerId || provider?.userId || provider?._id;
      if (!pid) {
        console.warn('Provider ID not found on provider object', provider);
        setBookings([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`/api/bookings/provider/${pid}`);

      let rawBookings = [];

      if (response.data && response.data.success) {
        rawBookings = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        rawBookings = response.data;
      } else {
        rawBookings = response.data?.data || [];
      }

      // ⭐ Yahan provider_service se hourlyRate pick kar rahe hain
      const formatted = rawBookings.map((b) => {
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
            ...(b.service || {}),
            cost: totalAmount,
          },
        };
      });

      setBookings(formatted);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/status?status=${encodeURIComponent(newStatus)}`);
      if (response.data && response.data.success) {
        setBookings(bookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ));
        alert('Booking status updated successfully!');
      } else {
        alert('Failed to update booking status: ' + (response.data?.message || 'Unknown'));
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': case 'IN-PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING': return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED': return ['IN_PROGRESS', 'CANCELLED'];
      case 'IN_PROGRESS': return ['COMPLETED'];
      default: return [];
    }
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.split(/[_-]/).map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(booking => booking.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Bookings</h1>
        <p className="text-gray-600">View and manage customer bookings</p>
        <button
          onClick={fetchBookings}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh Bookings
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All Bookings' : formatStatus(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Loading bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.service?.name || 'Service'}
                    </h3>
                    <p className="text-gray-600">
                      Booked by {booking.user?.name || booking.guestName || 'Customer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {formatStatus(booking.status)}
                    </span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      ${booking.service?.cost || '0'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Customer:</span>
                    <p className="text-gray-600">{booking.user?.name || booking.guestName || 'N/A'}</p>
                    <p className="text-gray-500">{booking.user?.email || booking.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Service Date & Time:</span>
                    <p className="text-gray-600">{booking.date} at {booking.time}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Service Address:</span>
                    <p className="text-gray-600">{booking.address || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Booked On:</span>
                    <p className="text-gray-600">
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {booking.specialInstructions && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">Special Instructions:</span>
                    <p className="text-gray-600">{booking.specialInstructions}</p>
                  </div>
                )}

                {getStatusActions(booking.status).length > 0 && (
                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Update Status:</span>
                    {getStatusActions(booking.status).map(action => (
                      <button
                        key={action}
                        onClick={() => updateBookingStatus(booking.id, action)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        Mark as {formatStatus(action)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any bookings yet." 
                : `No ${filter.toLowerCase()} bookings found.`}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => (b.status || '').toUpperCase() === 'PENDING').length}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter(b => (b.status || '').toUpperCase() === 'COMPLETED').length}
          </div>
          <div className="text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${bookings
              .filter(b => (b.status || '').toUpperCase() === 'COMPLETED')
              .reduce((sum, b) => sum + (b.service?.cost || 0), 0)}
          </div>
          <div className="text-gray-600">Total Earnings</div>
        </div>
      </div>
    </div>
  );
};

export default ProviderBookings;
