package com.LocalServices.LocalService.controller;

import com.LocalServices.LocalService.dto.ApiResponse;
import com.LocalServices.LocalService.dto.LoginRequest;
import com.LocalServices.LocalService.model.Booking;
import com.LocalServices.LocalService.model.User;
import com.LocalServices.LocalService.model.ServiceProvider;
import com.LocalServices.LocalService.service.BookingService;
import com.LocalServices.LocalService.service.UserService;
import com.LocalServices.LocalService.service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private ServiceProviderService providerService;
    private BookingService bookingService;

    // Customer Registration API
    @PostMapping("/addUser")
    public ResponseEntity<ApiResponse> registerCustomer(@RequestBody User user) {
        try {
            System.out.println("Received registration request: " + user.getEmail());

            // Check if email already exists
            if (userService.existsByEmail(user.getEmail())) {
                return ResponseEntity.ok(new ApiResponse(false, "Email already exists"));
            }

            // Save user to database
            User savedUser = userService.createUser(user);
            System.out.println("User registered successfully: " + savedUser.getId());

            return ResponseEntity.ok(new ApiResponse(true, "Registration successful", savedUser));
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            return ResponseEntity.ok(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    // Customer & Provider Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for: " + loginRequest.getEmail() + " Type: " + loginRequest.getUserType());

            if ("customer".equals(loginRequest.getUserType())) {
                // Customer login
                Optional<User> user = userService.getUserByEmail(loginRequest.getEmail());
                if (user.isPresent()) {
                    if (user.get().getPassword().equals(loginRequest.getPassword())) {
                        System.out.println("Customer login successful: " + user.get().getId());
                        return ResponseEntity.ok(new ApiResponse(true, "Login successful", user.get()));
                    } else {
                        return ResponseEntity.ok(new ApiResponse(false, "Invalid password"));
                    }
                } else {
                    return ResponseEntity.ok(new ApiResponse(false, "Customer not found"));
                }
            }
            else if ("provider".equals(loginRequest.getUserType())) {
                // Provider login
                Optional<ServiceProvider> provider = providerService.getProviderByEmail(loginRequest.getEmail());
                if (provider.isPresent()) {
                    if (provider.get().getPassword().equals(loginRequest.getPassword())) {
                        System.out.println("Provider login successful: " + provider.get().getId());
                        return ResponseEntity.ok(new ApiResponse(true, "Login successful", provider.get()));
                    } else {
                        return ResponseEntity.ok(new ApiResponse(false, "Invalid password"));
                    }
                } else {
                    return ResponseEntity.ok(new ApiResponse(false, "Provider not found"));
                }
            }
            else {
                return ResponseEntity.ok(new ApiResponse(false, "Invalid user type"));
            }

        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            return ResponseEntity.ok(new ApiResponse(false, "Login failed: " + e.getMessage()));
        }
    }


    // Provider Registration API
    @PostMapping("/addProvider")
    public ResponseEntity<ApiResponse> registerProvider(@RequestBody ServiceProvider provider) {
        try {
            System.out.println("Received provider registration: " + provider.getEmail());

            if (providerService.existsByEmail(provider.getEmail())) {
                return ResponseEntity.ok(new ApiResponse(false, "Email already exists"));
            }

            ServiceProvider savedProvider = providerService.createProvider(provider);
            System.out.println("Provider registered successfully: " + savedProvider.getId());

            return ResponseEntity.ok(new ApiResponse(true, "Registration successful", savedProvider));
        } catch (Exception e) {
            System.out.println("Provider registration error: " + e.getMessage());
            return ResponseEntity.ok(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }
    @GetMapping("/providers/{id}")
    public ResponseEntity<ApiResponse> getProviderById(@PathVariable Long id) {
        try {
            Optional<ServiceProvider> provider = providerService.getProviderById(id);
            if (provider.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "Provider found", provider.get()));
            } else {
                return ResponseEntity.ok(new ApiResponse(false, "Provider not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }

    // Get Provider Stats
    @GetMapping("/providers/{id}/stats")
    public ResponseEntity<ApiResponse> getProviderStats(@PathVariable Long id) {
        try {
            // Mock stats - aap actual implementation karein
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalBookings", 15);
            stats.put("pendingBookings", 3);
            stats.put("completedBookings", 10);
            stats.put("totalEarnings", 1250.00);
            stats.put("rating", 4.5);
            stats.put("totalReviews", 12);

            return ResponseEntity.ok(new ApiResponse(true, "Stats retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Error getting stats: " + e.getMessage()));
        }
    }

    // Get Provider Bookings
    @GetMapping("/providers/{id}/bookings")
    public ResponseEntity<ApiResponse> getProviderBookings(@PathVariable Long id) {
        try {
            List<Booking> bookings = bookingService.getProviderBookings(id);
            return ResponseEntity.ok(new ApiResponse(true, "Bookings retrieved", bookings));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
        //    for the  login GetMapping
//        @GetMapping("/login")
//        public ResponseEntity<String> handleLoginRefresh() {
//            return ResponseEntity.ok("React app will handle /login route");
//        }


}