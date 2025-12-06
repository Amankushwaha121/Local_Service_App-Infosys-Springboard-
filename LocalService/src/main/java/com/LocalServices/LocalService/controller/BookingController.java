package com.LocalServices.LocalService.controller;

import com.LocalServices.LocalService.dto.BookingRequest;
import com.LocalServices.LocalService.dto.ApiResponse;
import com.LocalServices.LocalService.model.Booking;
import com.LocalServices.LocalService.model.BookingStatus;
import com.LocalServices.LocalService.model.Service;
import com.LocalServices.LocalService.model.ServiceProvider;
import com.LocalServices.LocalService.model.User;
import com.LocalServices.LocalService.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(new ApiResponse(true, "Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getBookingById(@PathVariable Long id) {
        try {
            Optional<Booking> booking = bookingService.getBookingById(id);
            if (booking.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "Booking retrieved successfully", booking.get()));
            } else {
                return ResponseEntity.ok(new ApiResponse(false, "Booking not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve booking: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createBooking(@RequestBody Booking booking) {
        try {
            if (booking.getStatus() == null) {
                booking.setStatus(BookingStatus.PENDING);
            }

            Booking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(new ApiResponse(true, "Booking created successfully", savedBooking));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to create booking: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateBooking(@PathVariable Long id, @RequestBody Booking bookingDetails) {
        try {
            Booking updatedBooking = bookingService.updateBooking(id, bookingDetails);
            return ResponseEntity.ok(new ApiResponse(true, "Booking updated successfully", updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to update booking: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Booking booking = bookingService.getBookingById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            BookingStatus bookingStatus;
            try {
                bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.ok(new ApiResponse(false, "Invalid status: " + status));
            }

            booking.setStatus(bookingStatus);
            Booking updatedBooking = bookingService.updateBooking(id, booking);

            return ResponseEntity.ok(new ApiResponse(true, "Booking status updated successfully", updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to update booking status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(new ApiResponse(true, "Booking deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to delete booking: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUserBookings(@PathVariable Long userId) {
        try {
            List<Booking> bookings = bookingService.getUserBookings(userId);
            return ResponseEntity.ok(new ApiResponse(true, "User bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve user bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse> getProviderBookings(@PathVariable Long providerId) {
        try {
            List<Booking> bookings = bookingService.getProviderBookings(providerId);
            return ResponseEntity.ok(new ApiResponse(true, "Provider bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve provider bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getBookingsByStatus(@PathVariable String status) {
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            List<Booking> bookings = bookingService.getBookingsByStatus(bookingStatus);
            return ResponseEntity.ok(new ApiResponse(true, "Bookings retrieved successfully", bookings));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(new ApiResponse(false, "Invalid status: " + status));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createBookingFromRequest(@RequestBody BookingRequest bookingRequest) {
        try {
            Booking booking = new Booking();

            User user = new User();
            user.setId(bookingRequest.getUserId());
            booking.setUser(user);

            Service service = new Service();
            service.setId(bookingRequest.getServiceId());
            booking.setService(service);

            ServiceProvider provider = new ServiceProvider();
            provider.setId(bookingRequest.getProviderId());
            booking.setProvider(provider);

            booking.setDate(bookingRequest.getDate());
            booking.setTime(bookingRequest.getTime());
            booking.setSpecialInstructions(bookingRequest.getSpecialInstructions());
            booking.setContactPhone(bookingRequest.getContactPhone());
            booking.setAddress(bookingRequest.getAddress());
            booking.setStatus(BookingStatus.PENDING);

            Booking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(new ApiResponse(true, "Booking created successfully", savedBooking));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to create booking: " + e.getMessage()));
        }
    }
}
