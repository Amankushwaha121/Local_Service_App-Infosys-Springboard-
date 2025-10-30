import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProviderRegister = ({ setProvider }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    serviceTypes: [],
    experience: '',
    hourlyRate: '',
    address: '',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const serviceOptions = [
    'plumber', 'electrician', 'tutor', 'cleaner', 
    'gardener', 'mechanic', 'carpenter', 'painter'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'serviceTypes') {
      const updatedTypes = checked 
        ? [...formData.serviceTypes, value]
        : formData.serviceTypes.filter(type => type !== value);
      setFormData(prev => ({ ...prev, serviceTypes: updatedTypes }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (formData.serviceTypes.length === 0) newErrors.serviceTypes = 'Select at least one service type';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      console.log('Sending provider registration request...');
      
      const response = await axios.post('http://localhost:8080/addProvider', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        businessName: formData.businessName,
        serviceTypes: formData.serviceTypes,
        experience: formData.experience,
        hourlyRate: parseFloat(formData.hourlyRate),
        address: formData.address,
        location: formData.location,
        description: formData.description
      });

      console.log('Provider registration response:', response.data);

      if (response.data.success) {
        const providerData = response.data.data;
        
        // Set provider in state and localStorage
        setProvider(providerData);
        localStorage.setItem('provider', JSON.stringify(providerData));
        localStorage.setItem('userType', 'provider');
        localStorage.setItem('loginTime', new Date().toISOString());
        
        alert('Provider registration successful!');
        navigate('/provider/dashboard');
      } else {
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      console.error('Provider registration error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Become a Service Provider</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields same as before */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.businessName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your business name"
              disabled={loading}
            />
            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
          </div>
        </div>

        {/* Rest of the form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
              disabled={loading}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter password"
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm password"
              disabled={loading}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Types *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {serviceOptions.map(service => (
              <label key={service} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="serviceTypes"
                  value={service}
                  checked={formData.serviceTypes.includes(service)}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 capitalize">{service}</span>
              </label>
            ))}
          </div>
          {errors.serviceTypes && <p className="text-red-500 text-sm mt-1">{errors.serviceTypes}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.experience ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Years of experience"
              min="0"
              disabled={loading}
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($) *</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Hourly rate"
              min="0"
              step="0.01"
              disabled={loading}
            />
            {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your service location"
            disabled={loading}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your services and expertise..."
            rows="3"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your business address"
            rows="2"
            disabled={loading}
          />
        </div>

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register as Provider'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have a provider account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default ProviderRegister;
