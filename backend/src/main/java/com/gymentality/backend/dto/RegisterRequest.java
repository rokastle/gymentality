package com.gymentality.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public class RegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(
        regexp = "^\\+34 \\d{3}-\\d{3}-\\d{3}$",
        message = "Phone must follow format +34 600-123-456"
    )
    private String phone;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
        message = "Password must meet security requirements"
    )
    private String password;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^\\d{5}$", message = "Postal code must have 5 digits")
    private String postalCode;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Region is required")
    private String region;

    // Legacy field. No longer required for new card payments.
    private String iban;

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

    @NotNull(message = "Club is required")
    private Long clubId;

    @NotNull(message = "Membership plan is required")
    private Long membershipPlanId;

    @NotNull(message = "Workout plan is required")
    private Long workoutPlanId;

    @NotNull(message = "Terms must be accepted")
    private Boolean acceptedTerms;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

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

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public Long getMembershipPlanId() {
        return membershipPlanId;
    }

    public void setMembershipPlanId(Long membershipPlanId) {
        this.membershipPlanId = membershipPlanId;
    }

    public Long getWorkoutPlanId() {
        return workoutPlanId;
    }

    public void setWorkoutPlanId(Long workoutPlanId) {
        this.workoutPlanId = workoutPlanId;
    }

    public Boolean getAcceptedTerms() {
        return acceptedTerms;
    }

    public void setAcceptedTerms(Boolean acceptedTerms) {
        this.acceptedTerms = acceptedTerms;
    }
}