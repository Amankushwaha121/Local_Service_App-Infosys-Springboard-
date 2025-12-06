package com.LocalServices.LocalService.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequest {
    private Long userId;
    private Long serviceId;
    private Long providerId;
    private LocalDate date;
    private LocalTime time;
    private String specialInstructions;
    private String contactPhone;
    private String address;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(Long userId, Long serviceId, Long providerId, LocalDate date, LocalTime time) {
        this.userId = userId;
        this.serviceId = serviceId;
        this.providerId = providerId;
        this.date = date;
        this.time = time;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}