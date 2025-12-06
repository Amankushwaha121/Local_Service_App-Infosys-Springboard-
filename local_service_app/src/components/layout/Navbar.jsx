import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ user, provider, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    alert('Logged out successfully!');
  };

  const isLoggedIn = user || provider;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            LocalService
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-blue-600 transition-colors ${
                location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              Home
            </Link> 

            {/* Admin Link */}
            {/* <Link to="/admin" className="text-gray-700 hover:text-blue-600">
              Admin
            </Link> */}

            {isLoggedIn ? (
              <>
                {/* Provider Specific Links */}
                {provider && (
                  <>
                   <Link
                    to="/provider/dashboard"
                    className={`hover:text-blue-600 transition-colors ${
                      location.pathname === '/provider/dashboard' || location.pathname === '/profile'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                    {/* <Link 
                      to="/provider/services" 
                      className={`hover:text-blue-600 transition-colors ${
                        location.pathname === '/provider/services' ? 'text-blue-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      My Services
                    </Link> */}
                    <Link 
                      to="/provider/bookings" 
                      className={`hover:text-blue-600 transition-colors ${
                        location.pathname === '/provider/bookings' ? 'text-blue-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      Bookings
                    </Link>
                    <Link 
                      to="/provider/profile" 
                      className={`hover:text-blue-600 transition-colors ${
                        location.pathname === '/provider/profile' ? 'text-blue-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                     Profile
                    </Link>
                  </>
                )}

                {/* User Specific Links */}
                {user && (
                  <>
                    <Link 
                      to="/booking-status" 
                      className={`hover:text-blue-600 transition-colors ${
                        location.pathname === '/booking-status' ? 'text-blue-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/profile" 
                      className={`hover:text-blue-600 transition-colors ${
                        location.pathname === '/user/profile' ? 'text-blue-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      My Profile
                    </Link>
                  </>
                )}

                {/* Common for both */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
                
                <span className="text-gray-700">
                  Hello, {user ? user.name : provider.businessName}
                </span>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

