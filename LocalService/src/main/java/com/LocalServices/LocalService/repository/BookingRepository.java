package com.LocalServices.LocalService.repository;

import com.LocalServices.LocalService.model.Booking;
import com.LocalServices.LocalService.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_Id(Long userId);
    List<Booking> findByProvider_Id(Long providerId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByServiceId(Long serviceId);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
    List<Booking> findByProviderIdAndStatus(Long providerId, BookingStatus status);
    boolean existsByProviderId(Long providerId);

}