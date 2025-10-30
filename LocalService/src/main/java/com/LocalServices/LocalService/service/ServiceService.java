package com.LocalServices.LocalService.service;

import com.LocalServices.LocalService.model.Service;
import com.LocalServices.LocalService.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public List<com.LocalServices.LocalService.model.Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    public Service updateService(Long id, Service serviceDetails) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setName(serviceDetails.getName());
        service.setServiceType(serviceDetails.getServiceType());
        service.setExperience(serviceDetails.getExperience());
        service.setCost(serviceDetails.getCost());
        service.setAvailability(serviceDetails.getAvailability());
        service.setLocation(serviceDetails.getLocation());
        ((com.LocalServices.LocalService.model.Service) service).setDescription(serviceDetails.getDescription());

        return serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    public List<Service> searchServices(String serviceType, String location) {
        return serviceRepository.searchServices(serviceType, location);
    }

    public List<Service> getServicesByProvider(Long providerId) {
        return serviceRepository.findByProviderId(providerId);
    }
}