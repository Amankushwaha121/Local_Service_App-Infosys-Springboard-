import React from 'react';

const ServiceList = ({ services, onServiceSelect }) => {
  if (services.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Found</h3>
        <p className="text-gray-600">Try adjusting your search criteria to find more results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Available Services</h3>
      
      {services.map(service => (
        <div 
          key={service.id} 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onServiceSelect(service)}
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-lg font-semibold text-gray-800">{service.name}</h4>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              {service.serviceType}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{service.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Experience:</span>
              <p className="text-gray-600">{service.experience}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Cost:</span>
              <p className="text-gray-600">{service.cost}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Availability:</span>
              <p className="text-gray-600">{service.availability}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Rating:</span>
              <div className="flex items-center">
                <span className="text-yellow-500">⭐</span>
                <span className="ml-1 text-gray-600">{service.rating} ({service.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <span className="font-medium text-gray-700">Location:</span>
            <p className="text-gray-600">{service.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;