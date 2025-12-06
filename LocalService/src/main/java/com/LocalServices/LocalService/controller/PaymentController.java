package com.LocalServices.LocalService.controller;

import com.LocalServices.LocalService.dto.ApiResponse;
import com.LocalServices.LocalService.dto.PaymentRequest;
import com.LocalServices.LocalService.model.Payment;
import com.LocalServices.LocalService.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay/{bookingId}")
    public ResponseEntity<ApiResponse> payForBooking(
            @PathVariable Long bookingId,
            @RequestBody PaymentRequest request
    ) {
        try {
            Payment payment = paymentService.processPayment(bookingId, request);
            return ResponseEntity.ok(
                    new ApiResponse(true, "Payment successful", payment)
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    new ApiResponse(false, "Failed to process payment: " + e.getMessage())
            );
        }
    }
}
