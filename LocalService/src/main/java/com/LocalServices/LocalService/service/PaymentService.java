package com.LocalServices.LocalService.service;

import com.LocalServices.LocalService.dto.PaymentRequest;
import com.LocalServices.LocalService.model.*;
import com.LocalServices.LocalService.repository.BookingRepository;
import com.LocalServices.LocalService.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Dummy payment processing: always SUCCESS
    @Transactional
    public Payment processPayment(Long bookingId, PaymentRequest request) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        // if already paid, just return
        return paymentRepository.findByBooking_Id(bookingId).orElseGet(() -> {

            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(request.getAmount() != null
                    ? request.getAmount()
                    : (booking.getService() != null ? booking.getService().getCost() : 0.0));

            payment.setMethod(request.getMethod() != null ? request.getMethod() : PaymentMethod.CARD);

            // DUMMY: assume payment always succeeds
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId("DUMMY-" + UUID.randomUUID());
            payment.setCreatedAt(LocalDateTime.now());

            // update booking status to CONFIRMED
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            return paymentRepository.save(payment);
        });
    }
}
