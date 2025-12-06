package com.LocalServices.LocalService.controller;

import com.LocalServices.LocalService.dto.ApiResponse;
import com.LocalServices.LocalService.model.Service;
import com.LocalServices.LocalService.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllServices() {
        try {
            List<Service> services = serviceService.getAllServices();
            return ResponseEntity.ok(new ApiResponse(true, "Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve services: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchServices(
            @RequestParam String serviceType,
            @RequestParam String location) {
        try {
            List<Service> services = serviceService.searchServices(serviceType, location);
            return ResponseEntity.ok(new ApiResponse(true, "Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to search services: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getServiceById(@PathVariable Long id) {
        try {
            return serviceService.getServiceById(id)
                    .map(service -> ResponseEntity.ok(new ApiResponse(true, "Service retrieved successfully", service)))
                    .orElse(ResponseEntity.ok(new ApiResponse(false, "Service not found")));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve service: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createService(@RequestBody Service service) {
        try {
            Service saved = serviceService.createService(service);
            return ResponseEntity.ok(new ApiResponse(true, "Service saved successfully", saved));
        } catch (Exception e) {
            // yahi message frontend alert me dikhega
            return ResponseEntity.ok(new ApiResponse(false, "Failed to save service: " + e.getMessage()));
        }
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse> getServicesByProvider(@PathVariable Long providerId) {
        try {
            List<Service> services = serviceService.getServicesByProvider(providerId);
            return ResponseEntity.ok(
                    new ApiResponse(true, "Services by provider fetched successfully", services)
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    new ApiResponse(false, "Failed to fetch services by provider: " + e.getMessage())
            );
        }
    }
}
