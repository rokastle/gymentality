package com.gymentality.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(length = 16)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String address;

    @Column(name = "postal_code", length = 5)
    private String postalCode;

    private String city;

    private String country;

    private String region;

    @Column(length = 34)
    private String iban;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_plan_id")
    private Membership membershipPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id")
    private Membership workoutPlan;

    public User() {
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public User setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public User setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public User setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public User setPassword(String password) {
        this.password = password;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public User setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public User setRole(Role role) {
        this.role = role;
        return this;
    }

    public String getGender() {
        return gender;
    }

    public User setGender(String gender) {
        this.gender = gender;
        return this;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public User setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public User setAddress(String address) {
        this.address = address;
        return this;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public User setPostalCode(String postalCode) {
        this.postalCode = postalCode;
        return this;
    }

    public String getCity() {
        return city;
    }

    public User setCity(String city) {
        this.city = city;
        return this;
    }

    public String getCountry() {
        return country;
    }

    public User setCountry(String country) {
        this.country = country;
        return this;
    }

    public String getRegion() {
        return region;
    }

    public User setRegion(String region) {
        this.region = region;
        return this;
    }

    public String getIban() {
        return iban;
    }

    public User setIban(String iban) {
        this.iban = iban;
        return this;
    }

    public Club getClub() {
        return club;
    }

    public User setClub(Club club) {
        this.club = club;
        return this;
    }

    public Membership getMembershipPlan() {
        return membershipPlan;
    }

    public User setMembershipPlan(Membership membershipPlan) {
        this.membershipPlan = membershipPlan;
        return this;
    }

    public Membership getWorkoutPlan() {
        return workoutPlan;
    }

    public User setWorkoutPlan(Membership workoutPlan) {
        this.workoutPlan = workoutPlan;
        return this;
    }
}
