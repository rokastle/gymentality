package com.gymentality.backend.controller;

import com.gymentality.backend.dto.*;
import com.gymentality.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<AuthUserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(
                authService.updateCurrentUserProfile(authentication.getName(), request)
        );
    }

    @PutMapping("/me/payment-method")
    public ResponseEntity<AuthUserResponse> updatePaymentMethod(
            Authentication authentication,
            @Valid @RequestBody UpdatePaymentMethodRequest request
    ) {
        return ResponseEntity.ok(
                authService.updateCurrentUserPaymentMethod(authentication.getName(), request)
        );
    }
}
