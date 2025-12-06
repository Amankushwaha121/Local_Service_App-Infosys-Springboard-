import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceList from './ServiceList';
import { providersAPI } from '../services/api';

const ServiceSearch = ({ setSelectedService }) => {
  const [searchParams, setSearchParams] = useState({
    serviceType: '',
    location: '',
    useCurrentLocation: false
  });
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load all providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading all providers...');
      const providersData = await providersAPI.getAll();
      console.log('Providers loaded successfully:', providersData);
      
      setProviders(providersData);
      setFilteredProviders(providersData);
      
      if (!providersData || providersData.length === 0) {
        setError('No service providers available at the moment.');
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
      setError('Failed to load service providers. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Searching providers with params:', searchParams);
      
      // If both search fields are empty, show all providers
      if (!searchParams.serviceType && !searchParams.location) {
        const allProviders = await providersAPI.getAll();
        setFilteredProviders(allProviders);
        return;
      }

      const providersData = await providersAPI.search(
        searchParams.serviceType, 
        searchParams.location
      );
      
      console.log('Search results:', providersData);
      setFilteredProviders(providersData || []);
      
      if (!providersData || providersData.length === 0) {
        setError('No service providers found matching your criteria. Try different search terms.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed: ' + (error.message || 'Please try again.'));
      
      // Fallback: show all providers if search fails
      setFilteredProviders(providers);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchParams(prev => ({
            ...prev,
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            useCurrentLocation: true
          }));
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to retrieve your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleServiceSelect = (provider) => {
    // Convert provider to service-like object for compatibility
    const serviceLike = {
      id: provider.id,
      name: provider.businessName,
      serviceType: provider.serviceTypes ? provider.serviceTypes[0] : 'General',
      experience: provider.experience,
      cost: provider.hourlyRate,
      availability: 'Contact for availability',
      rating: provider.rating,
      reviews: provider.totalReviews,
      location: provider.location,
      description: provider.description,
      provider: provider // Include full provider object
    };
    
    setSelectedService(serviceLike);
    navigate(`/service/${provider.id}`);
  };

  const handleShowAll = () => {
    setFilteredProviders(providers);
    setSearchParams({ serviceType: '', location: '', useCurrentLocation: false });
    setError('');
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Service Providers</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                name="serviceType"
                value={searchParams.serviceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Service Types</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="tutor">Tutor</option>
                <option value="cleaner">Cleaner</option>
                <option value="gardener">Gardener</option>
                <option value="mechanic">Mechanic</option>
                <option value="carpenter">Carpenter</option>
                <option value="painter">Painter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="location"
                  value={searchParams.location}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city, area, or use current location"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  title="Use current location"
                >
                  📍
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Providers'}
            </button>
            
            <button
              type="button"
              onClick={handleShowAll}
              disabled={loading}
              className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-bold disabled:opacity-50"
            >
              Show All
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-2">Loading service providers...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              {filteredProviders.length > 0 
                ? `Found ${filteredProviders.length} service provider${filteredProviders.length > 1 ? 's' : ''}` 
                : 'No providers found'}
            </h3>
            {filteredProviders.length > 0 && (
              <button
                onClick={handleShowAll}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Show All Providers
              </button>
            )}
          </div>
          
          <ServiceList 
            services={filteredProviders.map(provider => ({
              id: provider.id,
              name: provider.businessName,
              serviceType: provider.serviceTypes ? provider.serviceTypes.join(', ') : 'General',
              experience: provider.experience,
              cost: provider.hourlyRate,
              availability: 'Contact for availability',
              rating: provider.rating,
              reviews: provider.totalReviews,
              location: provider.location,
              description: provider.description
            }))} 
            onServiceSelect={handleServiceSelect}
          />
        </>
      )}

     

    </div>
  );
};

export default ServiceSearch;
