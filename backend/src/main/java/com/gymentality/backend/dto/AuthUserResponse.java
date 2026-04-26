package com.gymentality.backend.dto;

import java.time.LocalDate;

public class AuthUserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String clubName;
    private String membershipPlanName;
    private String workoutPlanName;

    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String postalCode;
    private String city;
    private String country;
    private String region;

    private String paymentMethod;
    private String cardLast4;
    private String cardExpiryMonth;
    private String cardExpiryYear;
    private Boolean saveCardForFuture;

    public AuthUserResponse() {
    }

    public AuthUserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String role,
        String clubName,
        String membershipPlanName,
        String workoutPlanName,
        String phone,
        String gender,
        LocalDate dateOfBirth,
        String address,
        String postalCode,
        String city,
        String country,
        String region,
        String paymentMethod,
        String cardLast4,
        String cardExpiryMonth,
        String cardExpiryYear,
        Boolean saveCardForFuture
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.clubName = clubName;
        this.membershipPlanName = membershipPlanName;
        this.workoutPlanName = workoutPlanName;
        this.phone = phone;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
        this.region = region;
        this.paymentMethod = paymentMethod;
        this.cardLast4 = cardLast4;
        this.cardExpiryMonth = cardExpiryMonth;
        this.cardExpiryYear = cardExpiryYear;
        this.saveCardForFuture = saveCardForFuture;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getClubName() {
        return clubName;
    }

    public String getMembershipPlanName() {
        return membershipPlanName;
    }

    public String getWorkoutPlanName() {
        return workoutPlanName;
    }

    public String getPhone() {
        return phone;
    }

    public String getGender() {
        return gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public String getRegion() {
        return region;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getCardLast4() {
        return cardLast4;
    }

    public String getCardExpiryMonth() {
        return cardExpiryMonth;
    }

    public String getCardExpiryYear() {
        return cardExpiryYear;
    }

    public Boolean getSaveCardForFuture() {
        return saveCardForFuture;
    }
}