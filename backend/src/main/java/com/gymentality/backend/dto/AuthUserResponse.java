package com.gymentality.backend.dto;

public class AuthUserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String clubName;
    private String membershipPlanName;
    private String workoutPlanName;

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
        String workoutPlanName
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.clubName = clubName;
        this.membershipPlanName = membershipPlanName;
        this.workoutPlanName = workoutPlanName;
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
}