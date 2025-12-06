// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ProviderServices = ({ provider }) => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingService, setEditingService] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     serviceType: '',
//     experience: '',
//     cost: '',
//     availability: '',
//     location: '',
//     description: ''
//   });

//   useEffect(() => {
//     if (provider) {
//       fetchServices();
//     }
//   }, [provider]);

//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:8080/api/services/provider/${provider.id}`);
      
//       console.log('Services API Response:', response.data); // Debug log
      
//       if (response.data.success) {
//         setServices(response.data.data || []);
//       } else {
//         console.error('Failed to fetch services:', response.data.message);
//         setServices([]);
//       }
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       setServices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const serviceData = {
//         ...formData,
//         cost: parseFloat(formData.cost),
//         provider: { id: provider.id }
//       };

//       console.log('Sending service data:', serviceData); // Debug log

//       let response;
//       if (editingService) {
//         response = await axios.put(`http://localhost:8080/api/services/${editingService.id}`, serviceData);
//       } else {
//         response = await axios.post('http://localhost:8080/api/services', serviceData);
//       }
      
//       console.log('Save service response:', response.data); // Debug log
      
//       if (response.data.success) {
//         // IMMEDIATELY UPDATE THE LIST
//         if (editingService) {
//           // Update existing service
//           setServices(services.map(s => 
//             s.id === editingService.id ? response.data.data : s
//           ));
//           alert('Service updated successfully!');
//         } else {
//           // Add new service to the beginning of the list
//           setServices(prevServices => [response.data.data, ...prevServices]);
//           alert('Service added successfully!');
//         }
        
//         resetForm();
//       } else {
//         alert('Failed to save service: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('Error saving service:', error);
//       alert('Error saving service. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (serviceId) => {
//     if (!window.confirm('Are you sure you want to delete this service?')) return;
    
//     try {
//       const response = await axios.delete(`http://localhost:8080/api/services/${serviceId}`);
      
//       if (response.data.success) {
//         // IMMEDIATELY REMOVE FROM LIST
//         setServices(services.filter(s => s.id !== serviceId));
//         alert('Service deleted successfully!');
//       } else {
//         alert('Failed to delete service: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting service:', error);
//       alert('Error deleting service. Please try again.');
//     }
//   };

//   const handleEdit = (service) => {
//     setEditingService(service);
//     setFormData({
//       name: service.name,
//       serviceType: service.serviceType,
//       experience: service.experience,
//       cost: service.cost,
//       availability: service.availability,
//       location: service.location,
//       description: service.description
//     });
//     setShowAddForm(true);
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       serviceType: '',
//       experience: '',
//       cost: '',
//       availability: '',
//       location: '',
//       description: ''
//     });
//     setEditingService(null);
//     setShowAddForm(false);
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Services</h1>
//             <p className="text-gray-600">Add, edit, or remove your services</p>
//             <p className="text-sm text-green-600 mt-1">
//               Total Services: {services.length}
//             </p>
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={fetchServices}
//               className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//             >
//               Refresh
//             </button>
//             <button
//               onClick={() => setShowAddForm(true)}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//             >
//               + Add New Service
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-md">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800">Your Services ({services.length})</h2>
//             </div>

//             {loading ? (
//               <div className="p-8 text-center">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                 <p className="text-gray-600 mt-2">Loading services...</p>
//               </div>
//             ) : services.length > 0 ? (
//               <div className="divide-y divide-gray-200">
//                 {services.map(service => (
//                   <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
//                         <p className="text-gray-600 capitalize">{service.serviceType} Service</p>
//                       </div>
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
//                         {service.serviceType}
//                       </span>
//                     </div>

//                     <p className="text-gray-700 mb-3">{service.description}</p>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
//                       <div>
//                         <span className="font-medium text-gray-700">Cost:</span>
//                         <p className="text-gray-600">${service.cost}/hour</p>
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-700">Experience:</span>
//                         <p className="text-gray-600">{service.experience}</p>
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-700">Availability:</span>
//                         <p className="text-gray-600">{service.availability}</p>
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-700">Location:</span>
//                         <p className="text-gray-600">{service.location}</p>
//                       </div>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center space-x-1">
//                         <span className="text-yellow-500">⭐</span>
//                         <span className="text-gray-700">{service.rating || 'No ratings'}</span>
//                         {service.reviews > 0 && (
//                           <span className="text-gray-500">({service.reviews} reviews)</span>
//                         )}
//                       </div>
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleEdit(service)}
//                           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(service.id)}
//                           className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="p-8 text-center">
//                 <div className="text-6xl mb-4">🛠️</div>
//                 <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Added</h3>
//                 <p className="text-gray-600 mb-4">Start by adding your first service to get bookings</p>
//                 <button
//                   onClick={() => setShowAddForm(true)}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Add Your First Service
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {showAddForm && (
//           <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               {editingService ? 'Edit Service' : 'Add New Service'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., Emergency Plumbing"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
//                 <select
//                   name="serviceType"
//                   value={formData.serviceType}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select service type</option>
//                   <option value="plumber">Plumber</option>
//                   <option value="electrician">Electrician</option>
//                   <option value="tutor">Tutor</option>
//                   <option value="cleaner">Cleaner</option>
//                   <option value="gardener">Gardener</option>
//                   <option value="mechanic">Mechanic</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
//                 <input
//                   type="text"
//                   name="experience"
//                   value={formData.experience}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., 5 years"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($) *</label>
//                 <input
//                   type="number"
//                   name="cost"
//                   value={formData.cost}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., 75"
//                   min="0"
//                   step="0.01"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
//                 <input
//                   type="text"
//                   name="availability"
//                   value={formData.availability}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., Mon-Fri, 9AM-6PM"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., New York"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Describe your service..."
//                   rows="3"
//                   required
//                 />
//               </div>

//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
//                 >
//                   {loading ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProviderServices;