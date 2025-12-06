import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProviderDashboard = ({ provider }) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    rating: 0,
    totalReviews: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (provider && (provider.id || provider.providerId || provider._id)) {
      fetchDashboardData();
    }
  }, [provider]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const pid = provider?.id || provider?.providerId || provider?._id;
      if (!pid) throw new Error('Provider id missing');

      const bookingsResponse = await axios.get(`/api/bookings/provider/${pid}`);

      let bookings = [];
      if (bookingsResponse.data && bookingsResponse.data.success) bookings = bookingsResponse.data.data || [];
      else if (Array.isArray(bookingsResponse.data)) bookings = bookingsResponse.data;
      else bookings = bookingsResponse.data?.data || [];

      // ⭐ provider_service se hourlyRate -> cost set
      const formattedBookings = bookings.map((b) => {
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

      const total = formattedBookings.length;
      const pending = formattedBookings.filter(b => (b.status||'').toUpperCase() === 'PENDING').length;
      const completed = formattedBookings.filter(b => (b.status||'').toUpperCase() === 'COMPLETED').length;
      const earnings = formattedBookings
        .filter(b => (b.status||'').toUpperCase() === 'COMPLETED')
        .reduce((sum, booking) => sum + (booking.service?.cost || 0), 0);

      setStats(prev => ({
        ...prev,
        totalBookings: total,
        pendingBookings: pending,
        completedBookings: completed,
        totalEarnings: earnings
      }));

      setRecentBookings(formattedBookings.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setStats({
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        totalEarnings: 0,
        rating: 0,
        totalReviews: 0
      });
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch ((status||'').toUpperCase()) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {provider?.name}!
        </h1>
        <p className="text-gray-600">Manage your services and bookings from your dashboard</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>📧 {provider?.email}</span>
          <span>📞 {provider?.phone}</span>
          <span>📍 {provider?.location}</span>
          {stats.rating > 0 && (
            <span>⭐ {stats.rating} ({stats.totalReviews} reviews)</span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Bookings</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Pending</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Completed</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.completedBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Earnings</h3>
          <p className="text-3xl font-bold text-gray-900">${stats.totalEarnings}</p>
        </div>
      </div>

      {/* Recent bookings list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
          <Link to="/provider/bookings" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {recentBookings.length > 0 ? recentBookings.map(booking => (
            <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{booking.user?.name || 'Customer'}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{formatStatus(booking.status)}</span>
                </div>
                <p className="text-gray-600 text-sm">{booking.service?.name || 'Service'}</p>
                <p className="text-xs text-gray-500">{booking.date} at {booking.time}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-semibold text-gray-900">${booking.service?.cost || 0}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent bookings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
