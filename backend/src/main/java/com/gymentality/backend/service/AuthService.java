package com.gymentality.backend.service;

import com.gymentality.backend.dto.*;
import com.gymentality.backend.entity.*;
import com.gymentality.backend.exception.*;
import com.gymentality.backend.repository.*;
import com.gymentality.backend.security.CustomUserDetailsService;
import com.gymentality.backend.security.JwtService;
import java.util.Objects;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final MembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
        UserRepository userRepository,
        ClubRepository clubRepository,
        MembershipRepository membershipRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        CustomUserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        if (Boolean.FALSE.equals(request.getAcceptedTerms())) {
            throw new BadRequestException("You must accept the terms");
        }

        Long clubId = request.getClubId();
        Long membershipPlanId = request.getMembershipPlanId();
        Long workoutPlanId = request.getWorkoutPlanId();

        if (clubId == null) {
            throw new BadRequestException("Club is required");
        }

        if (membershipPlanId == null) {
            throw new BadRequestException("Membership plan is required");
        }

        if (workoutPlanId == null) {
            throw new BadRequestException("Workout plan is required");
        }

        Club club = clubRepository.findById(clubId)
            .orElseThrow(() -> new ResourceNotFoundException("Club not found"));

        Membership membershipPlan = membershipRepository.findById(membershipPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found"));

        Membership workoutPlan = membershipRepository.findById(workoutPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("Workout plan not found"));

        if (membershipPlan.getCategory() != MembershipCategory.ACCESS) {
            throw new BadRequestException("Selected membership plan is not valid");
        }

        if (workoutPlan.getCategory() != MembershipCategory.COACHING) {
            throw new BadRequestException("Selected workout plan is not valid");
        }

        User user = new User()
            .setFirstName(request.getFirstName().trim())
            .setLastName(request.getLastName().trim())
            .setGender(request.getGender().trim())
            .setDateOfBirth(request.getDateOfBirth())
            .setEmail(request.getEmail().trim().toLowerCase())
            .setPhone(request.getPhone().trim())
            .setPassword(passwordEncoder.encode(request.getPassword()))
            .setAddress(request.getAddress().trim())
            .setPostalCode(request.getPostalCode().trim())
            .setCity(request.getCity().trim())
            .setCountry(request.getCountry().trim())
            .setRegion(request.getRegion().trim())
            .setIban(request.getIban().trim().replace(" ", "").toUpperCase())
            .setRole(Role.USER)
            .setClub(club)
            .setMembershipPlan(membershipPlan)
            .setWorkoutPlan(workoutPlan);

        User savedUser = userRepository.save(Objects.requireNonNull(user));

        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    public AuthUserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapUser(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        org.springframework.security.core.userdetails.UserDetails userDetails =
            userDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, mapUser(user));
    }

    private AuthUserResponse mapUser(User user) {
        return new AuthUserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole().name(),
            user.getClub() != null ? user.getClub().getName() : null,
            user.getMembershipPlan() != null ? user.getMembershipPlan().getName() : null,
            user.getWorkoutPlan() != null ? user.getWorkoutPlan().getName() : null
        );
    }
}
