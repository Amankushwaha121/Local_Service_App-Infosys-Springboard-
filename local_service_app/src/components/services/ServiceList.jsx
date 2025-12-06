import React from 'react';

const ServiceList = ({ services, onServiceSelect }) => {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No services found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onServiceSelect(service)}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {service.name}
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Type:</span> {service.serviceType}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Location:</span> {service.location}
            </p>
            {service.cost && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Cost:</span> ${service.cost}
              </p>
            )}
            {service.experience && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Experience:</span> {service.experience}
              </p>
            )}
            {service.availability && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Availability:</span> {service.availability}
              </p>
            )}
            {service.rating > 0 && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Rating:</span> {service.rating} ({service.reviews} reviews)
              </p>
            )}
            {service.description && (
              <p className="text-gray-600 mt-3 text-sm">
                {service.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
