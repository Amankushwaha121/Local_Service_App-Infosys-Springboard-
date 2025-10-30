package com.LocalServices.LocalService.service;


import com.LocalServices.LocalService.model.Booking;
import com.LocalServices.LocalService.model.BookingStatus;
import com.LocalServices.LocalService.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        booking.setDate(bookingDetails.getDate());
        booking.setTime(bookingDetails.getTime());
        booking.setSpecialInstructions(bookingDetails.getSpecialInstructions());
        booking.setContactPhone(bookingDetails.getContactPhone());
        booking.setAddress(bookingDetails.getAddress());
        booking.setStatus(bookingDetails.getStatus());

        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getProviderBookings(Long providerId) {
        return bookingRepository.findByProviderId(providerId);
    }

    public List<Booking> getBookingsByStatus(BookingStatus bookingStatus) {
        return List.of();
    }
}