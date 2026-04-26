package com.gymentality.backend.service;

import com.gymentality.backend.dto.*;
import com.gymentality.backend.entity.*;
import com.gymentality.backend.exception.*;
import com.gymentality.backend.repository.*;
import com.gymentality.backend.security.CustomUserDetailsService;
import com.gymentality.backend.security.JwtService;
import java.time.LocalDate;
import java.util.Objects;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final MembershipRepository membershipRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            ClubRepository clubRepository,
            MembershipRepository membershipRepository,
            WorkoutPlanRepository workoutPlanRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
        this.workoutPlanRepository = workoutPlanRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        if (!Boolean.TRUE.equals(request.getAcceptedTerms())) {
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

        String paymentMethod = normalizePaymentMethod(request.getPaymentMethod());
        String cardLast4 = normalizeCardLast4(request.getCardLast4());
        String cardExpiryMonth = normalizeCardExpiryMonth(request.getCardExpiryMonth());
        String cardExpiryYear = normalizeCardExpiryYear(request.getCardExpiryYear());

        validatePaymentDetails(
                paymentMethod,
                cardLast4,
                cardExpiryMonth,
                cardExpiryYear);

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));

        Membership membershipPlan = membershipRepository.findById(membershipPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found"));

        WorkoutPlan workoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout plan not found"));

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
                .setPaymentMethod(paymentMethod)
                .setCardLast4(cardLast4)
                .setCardExpiryMonth(cardExpiryMonth)
                .setCardExpiryYear(cardExpiryYear)
                .setSaveCardForFuture(Boolean.TRUE.equals(request.getSaveCardForFuture()))
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

    public AuthUserResponse updateCurrentUserProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user
                .setFirstName(request.getFirstName().trim())
                .setLastName(request.getLastName().trim())
                .setDateOfBirth(request.getDateOfBirth())
                .setPhone(request.getPhone().trim())
                .setAddress(request.getAddress().trim())
                .setPostalCode(request.getPostalCode().trim())
                .setCity(request.getCity().trim())
                .setCountry(request.getCountry().trim())
                .setRegion(request.getRegion().trim());

        User savedUser = userRepository.save(user);

        return mapUser(savedUser);
    }

    public AuthUserResponse updateCurrentUserPaymentMethod(
            String email,
            UpdatePaymentMethodRequest request) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String paymentMethod = normalizePaymentMethod(request.getPaymentMethod());
        String cardLast4 = normalizeCardLast4(request.getCardLast4());
        String cardExpiryMonth = normalizeCardExpiryMonth(request.getCardExpiryMonth());
        String cardExpiryYear = normalizeCardExpiryYear(request.getCardExpiryYear());

        validatePaymentDetails(
                paymentMethod,
                cardLast4,
                cardExpiryMonth,
                cardExpiryYear);

        user
                .setPaymentMethod(paymentMethod)
                .setCardLast4(cardLast4)
                .setCardExpiryMonth(cardExpiryMonth)
                .setCardExpiryYear(cardExpiryYear)
                .setSaveCardForFuture(Boolean.TRUE.equals(request.getSaveCardForFuture()));

        User savedUser = userRepository.save(user);

        return mapUser(savedUser);
    }

    public AuthResponse updateEmail(String currentEmail, UpdateEmailRequest request) {
        User user = userRepository.findByEmail(currentEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newEmail = request.getNewEmail().trim().toLowerCase();

        if (newEmail.equals(user.getEmail())) {
            throw new BadRequestException("New email must be different from current email");
        }

        if (userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        user.setEmail(newEmail);

        User savedUser = userRepository.save(user);

        return buildAuthResponse(savedUser);
    }

    public AuthUserResponse updatePassword(String currentEmail, UpdatePasswordRequest request) {
        User user = userRepository.findByEmail(currentEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        User savedUser = userRepository.save(user);

        return mapUser(savedUser);
    }

    private AuthResponse buildAuthResponse(User user) {
        org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService
                .loadUserByUsername(user.getEmail());

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
                user.getWorkoutPlan() != null ? user.getWorkoutPlan().getName() : null,
                user.getPhone(),
                user.getGender(),
                user.getDateOfBirth(),
                user.getAddress(),
                user.getPostalCode(),
                user.getCity(),
                user.getCountry(),
                user.getRegion(),
                user.getPaymentMethod(),
                user.getCardLast4(),
                user.getCardExpiryMonth(),
                user.getCardExpiryYear(),
                user.getSaveCardForFuture());
    }

    private String normalizePaymentMethod(String paymentMethod) {
        return paymentMethod == null ? "" : paymentMethod.trim().toUpperCase();
    }

    private String normalizeCardLast4(String cardLast4) {
        return cardLast4 == null ? "" : cardLast4.replaceAll("\\D", "");
    }

    private String normalizeCardExpiryMonth(String cardExpiryMonth) {
        return cardExpiryMonth == null ? "" : cardExpiryMonth.trim();
    }

    private String normalizeCardExpiryYear(String cardExpiryYear) {
        return cardExpiryYear == null ? "" : cardExpiryYear.trim();
    }

    private void validatePaymentDetails(
            String paymentMethod,
            String cardLast4,
            String cardExpiryMonth,
            String cardExpiryYear) {
        if (!"CARD".equals(paymentMethod)) {
            throw new BadRequestException("Payment method must be card");
        }

        if (!cardLast4.matches("^\\d{4}$")) {
            throw new BadRequestException("Card last 4 digits are invalid");
        }

        if (!cardExpiryMonth.matches("^(0[1-9]|1[0-2])$")) {
            throw new BadRequestException("Card expiry month is invalid");
        }

        if (!cardExpiryYear.matches("^\\d{4}$")) {
            throw new BadRequestException("Card expiry year is invalid");
        }

        int expiryMonth = Integer.parseInt(cardExpiryMonth);
        int expiryYear = Integer.parseInt(cardExpiryYear);

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        if (expiryYear < currentYear || (expiryYear == currentYear && expiryMonth < currentMonth)) {
            throw new BadRequestException("Card expiry date is invalid");
        }
    }
}
