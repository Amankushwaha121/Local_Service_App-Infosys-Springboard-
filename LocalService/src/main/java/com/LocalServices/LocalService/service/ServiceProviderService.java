package com.LocalServices.LocalService.service;

import com.LocalServices.LocalService.model.ServiceProvider;
import com.LocalServices.LocalService.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceProviderRepository providerRepository;

    public List<ServiceProvider> getAllProviders() {
        return providerRepository.findAll();
    }

    public Optional<ServiceProvider> getProviderById(Long id) {
        return providerRepository.findById(id);
    }

    public Optional<ServiceProvider> getProviderByEmail(String email) {
        return providerRepository.findByEmail(email);
    }

    public ServiceProvider createProvider(ServiceProvider provider) {
        return providerRepository.save(provider);
    }

    public ServiceProvider updateProvider(Long id, ServiceProvider providerDetails) {
        ServiceProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + id));

        provider.setName(providerDetails.getName());
        provider.setBusinessName(providerDetails.getBusinessName());
        provider.setPhone(providerDetails.getPhone());
        provider.setServiceTypes(providerDetails.getServiceTypes());
        provider.setExperience(providerDetails.getExperience());
        provider.setHourlyRate(providerDetails.getHourlyRate());
        provider.setAddress(providerDetails.getAddress());
        provider.setLocation(providerDetails.getLocation());
        provider.setDescription(providerDetails.getDescription());

        return providerRepository.save(provider);
    }

//    public void deleteProvider(Long id) {
//        providerRepository.deleteById(id);
//    }

    public List<ServiceProvider> searchProviders(String serviceType, String location) {
        return providerRepository.findByServiceTypeAndLocation(serviceType, location);
    }

    public boolean existsByEmail(String email) {
        return providerRepository.existsByEmail(email);
    }
    // Admin ke liye verify/unverify update karne ka helper
    public ServiceProvider updateVerificationStatus(Long id, boolean status) {
        ServiceProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + id));
        provider.setIsVerified(status);
        return providerRepository.save(provider);
    }

    public void deleteProvider(Long id) {
        if (!providerRepository.existsById(id)) {
            throw new RuntimeException("Provider not found with id: " + id);
        }
        providerRepository.deleteById(id);
    }


}