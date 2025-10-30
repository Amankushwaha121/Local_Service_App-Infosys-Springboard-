package com.LocalServices.LocalService.repository;

import com.LocalServices.LocalService.model.Booking;
import com.LocalServices.LocalService.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByProviderId(Long providerId);
    List<Booking> findByStatus(BookingStatus status);

    // Find bookings by service ID
    List<Booking> findByServiceId(Long serviceId);

    // Find bookings by user and status
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    // Find bookings by provider and status
    List<Booking> findByProviderIdAndStatus(Long providerId, BookingStatus status);
}