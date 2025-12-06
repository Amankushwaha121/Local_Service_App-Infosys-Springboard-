package com.LocalServices.LocalService.dto;

import com.LocalServices.LocalService.model.PaymentMethod;

public class PaymentRequest {

    private Double amount;
    private PaymentMethod method;
    private String upiId;
    private String cardLast4;

    public PaymentRequest() {}

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public String getCardLast4() { return cardLast4; }
    public void setCardLast4(String cardLast4) { this.cardLast4 = cardLast4; }
}

