const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data;
};

// Auth APIs
export const authAPI = {
  login: (email, password, userType) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType }),
    }).then(handleResponse),

  registerCustomer: (userData) =>
    fetch(`${API_BASE_URL}/auth/addUser/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse),

  registerProvider: (providerData) =>
    fetch(`${API_BASE_URL}/auth/addUser/provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData),
    }).then(handleResponse),
};

// Services APIs
export const servicesAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/services`).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/services/${id}`).then(handleResponse),

  search: (serviceType, location) =>
    fetch(`${API_BASE_URL}/services/search?serviceType=${serviceType}&location=${location}`)
      .then(handleResponse),

  create: (serviceData) =>
    fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    }).then(handleResponse),
};

// Bookings APIs
export const bookingsAPI = {
  create: (bookingData) =>
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    }).then(handleResponse),

  getUserBookings: (userId) =>
    fetch(`${API_BASE_URL}/bookings/user/${userId}`)
      .then(handleResponse),

  getProviderBookings: (providerId) =>
    fetch(`${API_BASE_URL}/bookings/provider/${providerId}`)
      .then(handleResponse),

  updateStatus: (bookingId, status) =>
    fetch(`${API_BASE_URL}/bookings/${bookingId}/status?status=${status}`, {
      method: 'PUT',
    }).then(handleResponse),
};

// Helper function to format data for API
export const formatServiceForAPI = (service) => ({
  name: service.name,
  serviceType: service.serviceType,
  experience: service.experience,
  cost: parseFloat(service.cost.replace('$', '')),
  availability: service.availability,
  location: service.location,
  description: service.description,
  provider: { id: service.providerId }
});

export const formatBookingForAPI = (booking) => ({
  date: booking.date,
  time: booking.time,
  specialInstructions: booking.specialInstructions,
  contactPhone: booking.contactPhone,
  address: booking.address,
  user: { id: booking.userId },
  service: { id: booking.serviceId },
  provider: { id: booking.providerId }
});
