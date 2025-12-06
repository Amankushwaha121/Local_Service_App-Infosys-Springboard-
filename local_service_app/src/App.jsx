import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProviderRegister from './components/auth/ProviderRegister';
import ProviderDashboard from './components/provider/ProviderDashboard';
import ProviderProfile from './components/provider/ProviderProfile';
// import ProviderServices from './components/provider/ProviderServices';
import ProviderBookings from './components/provider/ProviderBookings';
import Profile from './components/profile/Profile';
import ServiceSearch from './components/services/ServiceSearch';
import ServiceDetail from './components/services/ServiceDetail';
import Booking from './components/booking/Booking';
import BookingStatus from './components/booking/BookingStatus';
 import AdminLogin from './components/Admin/AdminLogin';
 import AdminDashboard from './components/Admin/AdminDashboard';
 import AdminRoute from './components/Admin/AdminRoute';

function App() {
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Check if user is logged in on app start and browser refresh
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedProvider = localStorage.getItem('provider');
        const userType = localStorage.getItem('userType');
        const loginTime = localStorage.getItem('loginTime');
        
        // Check if session is expired (24 hours)
        if (loginTime) {
          const loginDate = new Date(loginTime);
          const currentDate = new Date();
          const hoursDiff = (currentDate - loginDate) / (1000 * 60 * 60);
          
          if (hoursDiff > 24) {
            // Session expired, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('provider');
            localStorage.removeItem('userType');
            localStorage.removeItem('loginTime');
            return;
          }
        }
        
        if (userType === 'customer' && savedUser) {
          setUser(JSON.parse(savedUser));
        } else if (userType === 'provider' && savedProvider) {
          setProvider(JSON.parse(savedProvider));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear corrupted storage
        localStorage.clear();
      }
    };

    checkAuthStatus();
  }, []);

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setProvider(null);
    localStorage.removeItem('user');
    localStorage.removeItem('provider');
    localStorage.removeItem('userType');
    localStorage.removeItem('loginTime');
  };
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user} 
        provider={provider} 
        onLogout={handleLogout} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ServiceSearch setSelectedService={setSelectedService} />} />
          <Route path="/login" element={<Login setUser={setUser} setProvider={setProvider} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route 
            path="/service/:id" 
            element={<ServiceDetail service={selectedService} />} 
          />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-status" element={<BookingStatus />} />
          <Route path="/register-provider" element={<ProviderRegister setProvider={setProvider} />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard provider={provider} />} />
            {/* <Route path="/provider/services" element={<ProviderServices provider={provider} setProvider={setProvider} />} /> */}
            <Route path="/provider/bookings" element={<ProviderBookings provider={provider} setProvider={setProvider}  />} />
            <Route 
              path="/provider/profile" 
              element={<ProviderProfile provider={provider} setProvider={setProvider} />} 
            />


           {/* Admin Routes */}
  
          <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          
         </Routes> 
      </main>
    </div>
  );
}

export default App;


