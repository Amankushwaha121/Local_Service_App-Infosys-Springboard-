// src/components/services/api.jsx

const API_BASE_URL = 'http://localhost:8080/api';

// Enhanced API helper
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('API Response:', data);
  
  // Your backend returns {success, message, data} structure
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message || 'Request failed');
  }
};

// Services APIs
export const servicesAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/services`).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/services/${id}`).then(handleResponse),

  search: (serviceType, location) => {
    const params = new URLSearchParams();
    if (serviceType && serviceType.trim() !== '') {
      params.append('serviceType', serviceType);
    }
    if (location && location.trim() !== '') {
      params.append('location', location);
    }
    
    const url = `${API_BASE_URL}/services/search?${params.toString()}`;
    console.log('Search URL:', url);
    
    return fetch(url).then(handleResponse);
  },

  create: (serviceData) =>
    fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    }).then(handleResponse),

  update: (id, serviceData) =>
    fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
};

// services/api.js mein yeh add karein
export const providersAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/providers`).then(handleResponse),

  search: (serviceType, location) => {
    const params = new URLSearchParams();
    if (serviceType && serviceType.trim() !== '') {
      params.append('serviceType', serviceType);
    }
    if (location && location.trim() !== '') {
      params.append('location', location);
    }
    
    const url = `${API_BASE_URL}/providers/search?${params.toString()}`;
    console.log('Provider Search URL:', url);
    
    return fetch(url).then(handleResponse);
  },

  getById: (id) =>
    fetch(`${API_BASE_URL}/providers/${id}`).then(handleResponse),
};