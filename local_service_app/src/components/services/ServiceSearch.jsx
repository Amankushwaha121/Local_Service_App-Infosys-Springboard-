import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceList from './ServiceList';
import { servicesAPI } from '../services/api';

const ServiceSearch = ({ setSelectedService }) => {
  const [searchParams, setSearchParams] = useState({
    serviceType: '',
    location: '',
    useCurrentLocation: false
  });
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load all services on component mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const servicesData = await servicesAPI.getAll();
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (error) {
      console.error('Failed to load services:', error);
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
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let servicesData;
      if (searchParams.serviceType || searchParams.location) {
        servicesData = await servicesAPI.search(
          searchParams.serviceType, 
          searchParams.location
        );
      } else {
        servicesData = await servicesAPI.getAll();
      }
      setFilteredServices(servicesData);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchParams(prev => ({
            ...prev,
            location: 'Current Location',
            useCurrentLocation: true
          }));
        },
        (error) => {
          alert('Unable to retrieve your location. Please enter manually.');
        }
      );
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    navigate(`/service/${service.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Nearby Services</h2>
        
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a service type</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="tutor">Tutor</option>
                <option value="cleaner">Cleaner</option>
                <option value="gardener">Gardener</option>
                <option value="mechanic">Mechanic</option>
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter location or use current location"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📍
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-blue-700 py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold disabled:opacity-50 border-2 hover:border-white hover:text-white"
          >
            {loading ? 'Searching...' : 'Search Services'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading services...</p>
        </div>
      ) : (
        <ServiceList 
          services={filteredServices} 
          onServiceSelect={handleServiceSelect}
        />
      )}
    </div>
  );
};

export default ServiceSearch;




