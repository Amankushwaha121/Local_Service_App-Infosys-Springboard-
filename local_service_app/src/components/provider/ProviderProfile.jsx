import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProviderProfile = ({ provider, setProvider }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: provider?.name || '',
    email: provider?.email || '',
    phone: provider?.phone || '',
    businessName: provider?.businessName || '',
    experience: provider?.experience || '',
    hourlyRate: provider?.hourlyRate || '',
    address: provider?.address || '',
    location: provider?.location || '',
    description: provider?.description || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name || '',
        email: provider.email || '',
        phone: provider.phone || '',
        businessName: provider.businessName || '',
        experience: provider.experience || '',
        hourlyRate: provider.hourlyRate || '',
        address: provider.address || '',
        location: provider.location || '',
        description: provider.description || ''
      });
    }
  }, [provider]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await axios.put(`http://localhost:8080/api/providers/${provider.id}`, formData);

      if (response.data.success) {
        const updatedProvider = response.data.data;
        setProvider(updatedProvider);
        localStorage.setItem('provider', JSON.stringify(updatedProvider));
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: provider?.name || '',
      email: provider?.email || '',
      phone: provider?.phone || '',
      businessName: provider?.businessName || '',
      experience: provider?.experience || '',
      hourlyRate: provider?.hourlyRate || '',
      address: provider?.address || '',
      location: provider?.location || '',
      description: provider?.description || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  if (!provider) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('Error') 
            ? 'bg-red-100 border border-red-400 text-red-700'
            : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 text-lg">{provider.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            {isEditing ? (
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 text-lg">{provider.businessName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 text-lg">{provider.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800 text-lg">{provider.phone}</p>
            )}
          </div>
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            {isEditing ? (
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5 years"
              />
            ) : (
              <p className="text-gray-800 text-lg">{provider.experience}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
            {isEditing ? (
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            ) : (
              <p className="text-gray-800 text-lg">
                {provider.hourlyRate ? `$${provider.hourlyRate}/hour` : 'Not set'}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800 text-lg">{provider.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          {isEditing ? (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          ) : (
            <p className="text-gray-800">{provider.address || 'Not provided'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe your business and services..."
            />
          ) : (
            <p className="text-gray-800">{provider.description || 'Not provided'}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Provider ID:</span>
            <p className="text-gray-600">{provider.id}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Registration Date:</span>
            <p className="text-gray-600">
              {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <p className="text-gray-600">
              {provider.updatedAt ? new Date(provider.updatedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
              provider.isVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {provider.isVerified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;