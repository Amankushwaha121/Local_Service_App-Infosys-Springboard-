package com.LocalServices.LocalService.service;

import com.LocalServices.LocalService.model.Booking;
import com.LocalServices.LocalService.model.BookingStatus;
import com.LocalServices.LocalService.model.ServiceProvider;
import com.LocalServices.LocalService.model.User;
import com.LocalServices.LocalService.repository.BookingRepository;
import com.LocalServices.LocalService.repository.ServiceProviderRepository;
import com.LocalServices.LocalService.repository.ServiceRepository;
import com.LocalServices.LocalService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final Logger logger = Logger.getLogger(BookingService.class.getName());

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    // --------------------------------------------------------------------
    // BASIC GET
    // --------------------------------------------------------------------
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // --------------------------------------------------------------------
    // CREATE: used by /api/bookings  (Booking payload with nested user/service/provider)
    //  -> service OPTIONAL now (no more "Service not found" error)
    // --------------------------------------------------------------------
    @Transactional
    public Booking createBooking(Booking booking) {

        if (booking == null) {
            throw new RuntimeException("Booking payload is required");
        }
        if (booking.getUser() == null || booking.getUser().getId() == null) {
            throw new RuntimeException("User is required");
        }
        if (booking.getProvider() == null || booking.getProvider().getId() == null) {
            throw new RuntimeException("Provider is required");
        }
        if (booking.getDate() == null) {
            throw new RuntimeException("Booking date is required");
        }
        if (booking.getTime() == null) {
            throw new RuntimeException("Booking time is required");
        }

        // fetch managed user + provider
        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + booking.getUser().getId()));

        ServiceProvider provider = serviceProviderRepository.findById(booking.getProvider().getId())
                .orElseThrow(() -> new RuntimeException("Provider not found: " + booking.getProvider().getId()));

        // SERVICE IS OPTIONAL HERE
        com.LocalServices.LocalService.model.Service serviceEntity = null;
        if (booking.getService() != null && booking.getService().getId() != null) {
            Long sId = booking.getService().getId();
            serviceEntity = serviceRepository.findById(sId).orElse(null);
            if (serviceEntity == null) {
                // sirf warn karo, error mat throw karo
                logger.warning("Service not found for id=" + sId + " → booking will be created without service");
            }
        }

        // duplicate check: same provider + date + time
        List<Booking> dup = bookingRepository.findByProvider_Id(provider.getId()).stream()
                .filter(b -> b.getDate() != null &&
                        b.getTime() != null &&
                        b.getDate().equals(booking.getDate()) &&
                        b.getTime().equals(booking.getTime()))
                .collect(Collectors.toList());
        if (!dup.isEmpty()) {
            throw new RuntimeException("Provider already has a booking on this date & time");
        }

        booking.setUser(user);
        booking.setProvider(provider);
        booking.setService(serviceEntity);   // null allowed

        if (booking.getStatus() == null) {
            booking.setStatus(BookingStatus.PENDING);
        }
        booking.setBookingDate(LocalDateTime.now());
        booking.setCreatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        logger.info("Booking created (createBooking) ⇒ id=" + saved.getId());
        return saved;
    }

    // --------------------------------------------------------------------
    // CREATE from request (userId, serviceId, providerId + Booking fields)
    //  -> service OPTIONAL yaha bhi
    // --------------------------------------------------------------------
    @Transactional
    public Booking createBookingFromRequest(Long userId,
                                            Long serviceId,
                                            Long providerId,
                                            Booking booking) {

        if (booking == null) {
            throw new RuntimeException("Booking payload is required");
        }
        if (userId == null) {
            throw new RuntimeException("UserId is required");
        }
        if (providerId == null) {
            throw new RuntimeException("ProviderId is required");
        }
        if (booking.getDate() == null) {
            throw new RuntimeException("Booking date is required");
        }
        if (booking.getTime() == null) {
            throw new RuntimeException("Booking time is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found: " + providerId));

        // SERVICE OPTIONAL
        com.LocalServices.LocalService.model.Service serviceEntity = null;
        if (serviceId != null) {
            serviceEntity = serviceRepository.findById(serviceId).orElse(null);
            if (serviceEntity == null) {
                logger.warning("Service not found for id=" + serviceId + " in createBookingFromRequest → continuing without service");
            }
        }

        // duplicate check: same provider + date + time
        List<Booking> dup = bookingRepository.findByProvider_Id(provider.getId()).stream()
                .filter(b -> b.getDate() != null &&
                        b.getTime() != null &&
                        b.getDate().equals(booking.getDate()) &&
                        b.getTime().equals(booking.getTime()))
                .collect(Collectors.toList());
        if (!dup.isEmpty()) {
            throw new RuntimeException("Provider already has a booking on this date & time");
        }

        booking.setUser(user);
        booking.setProvider(provider);
        booking.setService(serviceEntity);   // null allowed
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookingDate(LocalDateTime.now());
        booking.setCreatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        logger.info("Booking created (createBookingFromRequest) ⇒ id=" + saved.getId());
        return saved;
    }

    // --------------------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------------------
    @Transactional
    public Booking updateBooking(Long id, Booking details) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));

        if (details.getDate() != null) booking.setDate(details.getDate());
        if (details.getTime() != null) booking.setTime(details.getTime());
        if (details.getAddress() != null) booking.setAddress(details.getAddress());
        if (details.getContactPhone() != null) booking.setContactPhone(details.getContactPhone());
        if (details.getSpecialInstructions() != null) booking.setSpecialInstructions(details.getSpecialInstructions());

        if (details.getStatus() != null) {
            booking.setStatus(details.getStatus());
        }

        Booking saved = bookingRepository.save(booking);
        logger.info("Booking updated ⇒ id=" + saved.getId());
        return saved;
    }

    // --------------------------------------------------------------------
    // DELETE
    // --------------------------------------------------------------------
    @Transactional
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found: " + id);
        }
        bookingRepository.deleteById(id);
        logger.info("Booking deleted ⇒ id=" + id);
    }

    // --------------------------------------------------------------------
    // LIST HELPERS
    // --------------------------------------------------------------------
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUser_Id(userId);
    }

    public List<Booking> getProviderBookings(Long providerId) {
        return bookingRepository.findByProvider_Id(providerId);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        if (status == null) return List.of();
        return bookingRepository.findByStatus(status);
    }
    public boolean hasBookingsForProvider(Long providerId) {
        return bookingRepository.existsByProviderId(providerId);
    }

}

