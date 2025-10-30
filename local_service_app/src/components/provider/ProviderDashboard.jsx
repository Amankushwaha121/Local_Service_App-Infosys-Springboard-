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
    if (provider && provider.id) {
      fetchDashboardData();
    }
  }, [provider]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching provider dashboard data for:', provider.id);
      
      // Fetch provider stats
      const statsResponse = await axios.get(`http://localhost:8080/providers/${provider.id}/stats`);
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch recent bookings
      const bookingsResponse = await axios.get(`http://localhost:8080/providers/${provider.id}/bookings`);
      if (bookingsResponse.data.success) {
        const bookings = bookingsResponse.data.data;
        setRecentBookings(bookings.slice(0, 5)); // Show only 5 recent bookings
        
        // Calculate stats from actual bookings if needed
        if (bookings.length > 0) {
          const total = bookings.length;
          const pending = bookings.filter(b => b.status === 'PENDING').length;
          const completed = bookings.filter(b => b.status === 'COMPLETED').length;
          const earnings = bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, booking) => sum + (booking.service?.cost || 0), 0);
          
          setStats(prev => ({
            ...prev,
            totalBookings: total,
            pendingBookings: pending,
            completedBookings: completed,
            totalEarnings: earnings
          }));
        }
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Fallback to mock data if API fails
      setStats({
        totalBookings: 12,
        pendingBookings: 3,
        completedBookings: 8,
        totalEarnings: 1250,
        rating: 4.5,
        totalReviews: 12
      });
      
      setRecentBookings([
        {
          id: 1,
          customerName: 'John Doe',
          service: { name: 'Plumbing Repair', cost: 75 },
          date: '2024-01-15',
          time: '10:00 AM',
          status: 'CONFIRMED'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
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

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {provider?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your services and bookings from your dashboard
        </p>
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
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Bookings</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Pending</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Completed</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.completedBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Earnings</h3>
              <p className="text-3xl font-bold text-gray-900">${stats.totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/provider/services"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500 text-center group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🛠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Services</h3>
          <p className="text-gray-600">Add or edit your services</p>
        </Link>

        <Link
          to="/provider/bookings"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500 text-center group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📅</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">View Bookings</h3>
          <p className="text-gray-600">Manage customer bookings</p>
        </Link>

        <Link
          to="/provider/profile"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500 text-center group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👤</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Settings</h3>
          <p className="text-gray-600">Update your business info</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
            <Link
              to="/provider/bookings"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {booking.user?.name || 'Customer'}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">
                      {booking.service?.name || 'Service'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-semibold text-gray-900">
                      ${booking.service?.cost || 0}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent bookings</p>
                <p className="text-sm mt-1">Bookings will appear here when customers book your services</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Business Info</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-700">Business Name:</span>
              <span className="text-gray-900">{provider?.businessName}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-700">Service Types:</span>
              <span className="text-gray-900">
                {Array.isArray(provider?.serviceTypes) 
                  ? provider.serviceTypes.join(', ') 
                  : provider?.serviceTypes}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-700">Experience:</span>
              <span className="text-gray-900">{provider?.experience}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-700">Hourly Rate:</span>
              <span className="text-gray-900">${provider?.hourlyRate}/hour</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-700">Location:</span>
              <span className="text-gray-900">{provider?.location}</span>
            </div>
            
            {provider?.description && (
              <div className="py-2">
                <span className="font-medium text-gray-700 block mb-2">Description:</span>
                <p className="text-gray-900 text-sm">{provider.description}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Link
              to="/provider/profile"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
            >
              Edit Business Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchDashboardData}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default ProviderDashboard;
