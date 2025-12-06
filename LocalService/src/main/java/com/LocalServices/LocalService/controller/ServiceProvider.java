package com.LocalServices.LocalService.controller;

import com.LocalServices.LocalService.dto.ApiResponse;
import com.LocalServices.LocalService.model.ServiceProvider;
import com.LocalServices.LocalService.repository.ServiceProviderRepository;
import com.LocalServices.LocalService.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "http://localhost:5173")
class ServiceProviderController {

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private BookingService bookingService;


    @GetMapping
    public ResponseEntity<ApiResponse> getAllProviders() {
        try {
            List<ServiceProvider> providers = serviceProviderRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(true, "Providers retrieved successfully", providers));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve providers: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchProviders(
            @RequestParam(required = false) String serviceType,
            @RequestParam(required = false) String location) {
        try {
            System.out.println("Searching providers - ServiceType: " + serviceType + ", Location: " + location);

            List<ServiceProvider> providers;

            if (serviceType != null && location != null) {
                providers = serviceProviderRepository.findByServiceTypeAndLocation(serviceType, location);
            } else if (serviceType != null) {
                // Search by service type in the list
                providers = serviceProviderRepository.findAll().stream()
                        .filter(provider -> provider.getServiceTypes() != null &&
                                provider.getServiceTypes().contains(serviceType))
                        .toList();
            } else if (location != null) {
                providers = serviceProviderRepository.findByLocationContaining(location);
            } else {
                providers = serviceProviderRepository.findAll();
            }

            return ResponseEntity.ok(new ApiResponse(true, "Providers retrieved successfully", providers));
        } catch (Exception e) {
            System.err.println("Search error: " + e.getMessage());
            return ResponseEntity.ok(new ApiResponse(false, "Failed to search providers: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProviderById(@PathVariable Long id) {
        try {
            return serviceProviderRepository.findById(id)
                    .map(provider -> ResponseEntity.ok(new ApiResponse(true, "Provider retrieved successfully", provider)))
                    .orElse(ResponseEntity.ok(new ApiResponse(false, "Provider not found")));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve provider: " + e.getMessage()));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProvider(@PathVariable Long id) {
        try {
            if (!serviceProviderRepository.existsById(id)) {
                return ResponseEntity.ok(new ApiResponse(false, "Provider not found"));
            }

            // 🔴 CHECK: kya is provider ke bookings hain?
            if (bookingService.hasBookingsForProvider(id)) {
                return ResponseEntity.ok(
                        new ApiResponse(false,
                                "Cannot delete provider because there are bookings linked to this provider. " +
                                        "Please cancel or remove those bookings first.")
                );
            }

            // Safe: koi booking nahi → ab delete allowed
            serviceProviderRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Provider deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new ApiResponse(false, "Failed to delete provider: " + e.getMessage())
            );
        }
    }
}
