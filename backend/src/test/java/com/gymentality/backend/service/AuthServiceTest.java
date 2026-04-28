package com.gymentality.backend.service;

import com.gymentality.backend.dto.RegisterRequest;
import com.gymentality.backend.entity.Club;
import com.gymentality.backend.entity.Membership;
import com.gymentality.backend.entity.Role;
import com.gymentality.backend.entity.User;
import com.gymentality.backend.entity.WorkoutPlan;
import com.gymentality.backend.exception.EmailAlreadyExistsException;
import com.gymentality.backend.repository.ClubRepository;
import com.gymentality.backend.repository.MembershipRepository;
import com.gymentality.backend.repository.UserRepository;
import com.gymentality.backend.repository.WorkoutPlanRepository;
import com.gymentality.backend.security.CustomUserDetailsService;
import com.gymentality.backend.security.JwtService;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private WorkoutPlanRepository workoutPlanRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerShouldCreateUserWhenRequestIsValid() {
        RegisterRequest request = buildValidRegisterRequest();

        Club club = new Club();
        club.setName("Gymentality Málaga");

        Membership membership = new Membership();
        membership.setName("Premium");

        WorkoutPlan workoutPlan = new WorkoutPlan();
        workoutPlan.setName("Integral");

        User savedUser = new User()
                .setFirstName("Roberto")
                .setLastName("Castillo")
                .setGender("Male")
                .setDateOfBirth(LocalDate.of(1990, 1, 1))
                .setEmail("socio@gymentality.com")
                .setPhone("+34 600-123-456")
                .setPassword("encoded-password")
                .setAddress("Calle Test 1")
                .setPostalCode("29001")
                .setCity("Málaga")
                .setCountry("España")
                .setRegion("Andalucía")
                .setPaymentMethod("CARD")
                .setCardLast4("1111")
                .setCardExpiryMonth("12")
                .setCardExpiryYear(String.valueOf(LocalDate.now().getYear() + 1))
                .setSaveCardForFuture(true)
                .setRole(Role.USER)
                .setClub(club)
                .setMembershipPlan(membership)
                .setWorkoutPlan(workoutPlan);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("socio@gymentality.com")
                .password("encoded-password")
                .authorities("ROLE_USER")
                .build();

        when(userRepository.existsByEmail("socio@gymentality.com")).thenReturn(false);
        when(clubRepository.findById(1L)).thenReturn(Optional.of(club));
        when(membershipRepository.findById(1L)).thenReturn(Optional.of(membership));
        when(workoutPlanRepository.findById(1L)).thenReturn(Optional.of(workoutPlan));
        when(passwordEncoder.encode("Password1@")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(userDetailsService.loadUserByUsername("socio@gymentality.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        var response = authService.register(request);

        assertNotNull(response);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User userToSave = userCaptor.getValue();

        assertEquals("Roberto", userToSave.getFirstName());
        assertEquals("Castillo", userToSave.getLastName());
        assertEquals("socio@gymentality.com", userToSave.getEmail());
        assertEquals("encoded-password", userToSave.getPassword());
        assertEquals("CARD", userToSave.getPaymentMethod());
        assertEquals("1111", userToSave.getCardLast4());
        assertEquals(Role.USER, userToSave.getRole());
        assertEquals(club, userToSave.getClub());
        assertEquals(membership, userToSave.getMembershipPlan());
        assertEquals(workoutPlan, userToSave.getWorkoutPlan());
    }

    @Test
    void registerShouldThrowExceptionWhenEmailAlreadyExists() {
        RegisterRequest request = buildValidRegisterRequest();

        when(userRepository.existsByEmail("socio@gymentality.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));

        verify(userRepository, never()).save(any(User.class));
    }

    private RegisterRequest buildValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();

        request.setFirstName("Roberto");
        request.setLastName("Castillo");
        request.setGender("Male");
        request.setDateOfBirth(LocalDate.of(1990, 1, 1));
        request.setEmail(" SOCIO@gymentality.com ");
        request.setPhone("+34 600-123-456");
        request.setPassword("Password1@");
        request.setAddress("Calle Test 1");
        request.setPostalCode("29001");
        request.setCountry("España");
        request.setRegion("Andalucía");
        request.setCity("Málaga");
        request.setClubId(1L);
        request.setMembershipPlanId(1L);
        request.setWorkoutPlanId(1L);
        request.setPaymentMethod("card");
        request.setCardLast4("1111");
        request.setCardExpiryMonth("12");
        request.setCardExpiryYear(String.valueOf(LocalDate.now().getYear() + 1));
        request.setSaveCardForFuture(true);
        request.setAcceptedTerms(true);

        return request;
    }
}
