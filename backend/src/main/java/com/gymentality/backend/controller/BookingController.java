package com.gymentality.backend.controller;

import com.gymentality.backend.dto.BookingActionResponse;
import com.gymentality.backend.dto.CancelBookingRequest;
import com.gymentality.backend.dto.CreateBookingRequest;
import com.gymentality.backend.dto.UpcomingBookingResponse;
import com.gymentality.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingActionResponse createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Principal principal) {

        return bookingService.createBooking(
                request.getClubClassId(),
                request.getClassDate(),
                principal.getName());
    }

    @PostMapping("/cancel")
    public BookingActionResponse cancelBooking(
            @Valid @RequestBody CancelBookingRequest request,
            Principal principal) {
        return bookingService.cancelBooking(
                request.getClubClassId(),
                request.getClassDate(),
                principal.getName());
    }

    @GetMapping("/me/upcoming")
    public List<UpcomingBookingResponse> getMyUpcomingBookings(Principal principal) {
        return bookingService.getUpcomingBookings(principal.getName());
    }
}