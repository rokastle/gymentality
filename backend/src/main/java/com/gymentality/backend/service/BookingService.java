package com.gymentality.backend.service;

import com.gymentality.backend.dto.BookingActionResponse;
import com.gymentality.backend.dto.UpcomingBookingResponse;
import com.gymentality.backend.entity.*;
import com.gymentality.backend.exception.BadRequestException;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.exception.UnauthorizedException;
import com.gymentality.backend.repository.BookingRepository;
import com.gymentality.backend.repository.ClubClassRepository;
import com.gymentality.backend.repository.UserRepository;
import com.gymentality.backend.util.ClubClassScheduleUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ClubClassRepository clubClassRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public BookingService(
            BookingRepository bookingRepository,
            ClubClassRepository clubClassRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.clubClassRepository = clubClassRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public BookingActionResponse createBooking(Long clubClassId, LocalDate classDate, String userEmail) {
        User user = getRequiredUserByEmail(userEmail);
        ClubClass clubClass = getRequiredClubClass(clubClassId);

        validateSameClub(user, clubClass);
        validateClassDateMatchesSchedule(clubClass, classDate);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime classStartAt = ClubClassScheduleUtils.getClassStartDateTime(clubClass, classDate);
        LocalDateTime bookingOpensAt = classStartAt.minusHours(48);

        if (!classStartAt.isAfter(now)) {
            throw new BadRequestException("No puedes reservar una clase ya iniciada o pasada.");
        }

        if (now.isBefore(bookingOpensAt)) {
            throw new BadRequestException("Booking is not open yet for this class.");
        }

        Booking existingBooking = bookingRepository
                .findByUserIdAndClubClassIdAndClassDate(user.getId(), clubClassId, classDate)
                .orElse(null);

        if (existingBooking != null &&
                (existingBooking.getStatus() == BookingStatus.CONFIRMED
                        || existingBooking.getStatus() == BookingStatus.WAITLISTED)) {
            throw new BadRequestException("Ya tienes una reserva o una entrada en lista de espera para esta clase.");
        }

        long confirmedCount = bookingRepository.countByClubClassIdAndClassDateAndStatus(
                clubClassId,
                classDate,
                BookingStatus.CONFIRMED);

        BookingStatus newStatus = confirmedCount < clubClass.getCapacity()
                ? BookingStatus.CONFIRMED
                : BookingStatus.WAITLISTED;

        Booking booking = existingBooking != null
                ? existingBooking
                : Booking.builder()
                        .user(user)
                        .clubClass(clubClass)
                        .classDate(classDate)
                        .build();

        booking.setStatus(newStatus);
        booking.setBookingDate(now);
        booking.setCreatedAt(now);
        booking.setCancelledAt(null);

        bookingRepository.save(booking);

        if (newStatus == BookingStatus.CONFIRMED) {
            notificationService.createBookingConfirmedNotification(user, clubClass, classDate);
        } else {
            notificationService.createWaitlistNotification(user, clubClass, classDate);
        }

        String message = newStatus == BookingStatus.CONFIRMED
                ? "Class booked successfully"
                : "Class is full. Added to waiting list successfully";

        return BookingActionResponse.builder()
                .clubClassId(clubClassId)
                .classDate(classDate)
                .bookingStatus(newStatus)
                .message(message)
                .build();
    }

    @Transactional
    public BookingActionResponse cancelBooking(Long clubClassId, LocalDate classDate, String userEmail) {
        User user = getRequiredUserByEmail(userEmail);
        ClubClass clubClass = getRequiredClubClass(clubClassId);

        validateSameClub(user, clubClass);

        Booking booking = bookingRepository
                .findByUserIdAndClubClassIdAndClassDate(user.getId(), clubClassId, classDate)
                .orElseThrow(() -> new ResourceNotFoundException("No tienes reserva para esta clase en esa fecha."));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("La reserva ya estaba cancelada.");
        }

        boolean wasConfirmed = booking.getStatus() == BookingStatus.CONFIRMED;

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        bookingRepository.save(booking);
        notificationService.createBookingCancelledNotification(user, clubClass, classDate);

        if (wasConfirmed) {
            promoteFirstWaitlistedUser(clubClassId, classDate);
        }

        return BookingActionResponse.builder()
                .clubClassId(clubClassId)
                .classDate(classDate)
                .bookingStatus(BookingStatus.CANCELLED)
                .message("Reservation cancelled successfully")
                .build();
    }

    public List<UpcomingBookingResponse> getUpcomingBookings(String userEmail) {
        User user = getRequiredUserByEmail(userEmail);

        List<Booking> bookings = bookingRepository.findByUserIdAndClassDateGreaterThanEqualAndStatusIn(
                user.getId(),
                LocalDate.now(),
                List.of(BookingStatus.CONFIRMED, BookingStatus.WAITLISTED));

        return bookings.stream()
                .sorted(Comparator
                        .comparing(Booking::getClassDate)
                        .thenComparing(
                                booking -> ClubClassScheduleUtils
                                        .extractStartTime(booking.getClubClass().getSchedule())))
                .map(this::mapToUpcomingResponse)
                .toList();
    }

    private void promoteFirstWaitlistedUser(Long clubClassId, LocalDate classDate) {
        List<Booking> waitlist = bookingRepository.findByClubClassIdAndClassDateAndStatusOrderByCreatedAtAsc(
                clubClassId,
                classDate,
                BookingStatus.WAITLISTED);

        if (waitlist.isEmpty()) {
            return;
        }

        Booking promotedBooking = waitlist.get(0);
        promotedBooking.setStatus(BookingStatus.CONFIRMED);
        promotedBooking.setCancelledAt(null);
        bookingRepository.save(promotedBooking);

        notificationService.createWaitlistPromotedNotification(
                promotedBooking.getUser(),
                promotedBooking.getClubClass(),
                promotedBooking.getClassDate());
    }

    private UpcomingBookingResponse mapToUpcomingResponse(Booking booking) {
        Integer waitlistPosition = null;

        if (booking.getStatus() == BookingStatus.WAITLISTED) {
            List<Booking> waitlist = bookingRepository.findByClubClassIdAndClassDateAndStatusOrderByCreatedAtAsc(
                    booking.getClubClass().getId(),
                    booking.getClassDate(),
                    BookingStatus.WAITLISTED);

            for (int i = 0; i < waitlist.size(); i++) {
                if (waitlist.get(i).getId().equals(booking.getId())) {
                    waitlistPosition = i + 1;
                    break;
                }
            }
        }

        return UpcomingBookingResponse.builder()
                .bookingId(booking.getId())
                .clubClassId(booking.getClubClass().getId())
                .className(booking.getClubClass().getName())
                .category(booking.getClubClass().getCategory().name())
                .clubName(booking.getClubClass().getClub().getName())
                .classDate(booking.getClassDate())
                .startTime(ClubClassScheduleUtils.extractStartTime(booking.getClubClass().getSchedule()).toString())
                .status(booking.getStatus())
                .waitlistPosition(waitlistPosition)
                .build();
    }

    private User getRequiredUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new UnauthorizedException("Usuario no autenticado.");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado."));
    }

    private ClubClass getRequiredClubClass(Long clubClassId) {
        if (clubClassId == null) {
            throw new BadRequestException("El id de la clase es obligatorio.");
        }

        return clubClassRepository.findById(clubClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada con id: " + clubClassId));
    }

    private void validateSameClub(User user, ClubClass clubClass) {
        if (user.getClub() == null || !user.getClub().getId().equals(clubClass.getClub().getId())) {
            throw new UnauthorizedException("Solo puedes interactuar con clases de tu club.");
        }
    }

    private void validateClassDateMatchesSchedule(ClubClass clubClass, LocalDate classDate) {
        if (!ClubClassScheduleUtils.matchesDate(clubClass, classDate)) {
            throw new BadRequestException("La fecha seleccionada no corresponde al horario de esta clase.");
        }
    }
}
