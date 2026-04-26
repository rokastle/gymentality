package com.gymentality.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdatePaymentMethodRequest {

    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "(?i)^card$", message = "Payment method must be card")
    private String paymentMethod;

    @NotBlank(message = "Card last 4 digits are required")
    @Pattern(regexp = "^\\d{4}$", message = "Card last 4 digits must have 4 digits")
    private String cardLast4;

    @NotBlank(message = "Card expiry month is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Card expiry month must be between 01 and 12")
    private String cardExpiryMonth;

    @NotBlank(message = "Card expiry year is required")
    @Pattern(regexp = "^\\d{4}$", message = "Card expiry year must have 4 digits")
    private String cardExpiryYear;

    private Boolean saveCardForFuture;

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCardLast4() {
        return cardLast4;
    }

    public void setCardLast4(String cardLast4) {
        this.cardLast4 = cardLast4;
    }

    public String getCardExpiryMonth() {
        return cardExpiryMonth;
    }

    public void setCardExpiryMonth(String cardExpiryMonth) {
        this.cardExpiryMonth = cardExpiryMonth;
    }

    public String getCardExpiryYear() {
        return cardExpiryYear;
    }

    public void setCardExpiryYear(String cardExpiryYear) {
        this.cardExpiryYear = cardExpiryYear;
    }

    public Boolean getSaveCardForFuture() {
        return saveCardForFuture;
    }

    public void setSaveCardForFuture(Boolean saveCardForFuture) {
        this.saveCardForFuture = saveCardForFuture;
    }
}
