package com.gymentality.backend.service;

import com.gymentality.backend.dto.ClassScheduleItemResponse;
import com.gymentality.backend.dto.NotificationRequestResponse;
import com.gymentality.backend.entity.*;
import com.gymentality.backend.exception.BadRequestException;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.exception.UnauthorizedException;
import com.gymentality.backend.repository.BookingRepository;
import com.gymentality.backend.repository.ClassNotificationRequestRepository;
import com.gymentality.backend.repository.ClubClassRepository;
import com.gymentality.backend.repository.UserRepository;
import com.gymentality.backend.util.ClubClassScheduleUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ClubClassService {

    private final ClubClassRepository clubClassRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ClassNotificationRequestRepository classNotificationRequestRepository;
    private final NotificationService notificationService;

    public ClubClassService(
            ClubClassRepository clubClassRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ClassNotificationRequestRepository classNotificationRequestRepository,
            NotificationService notificationService) {
        this.clubClassRepository = clubClassRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.classNotificationRequestRepository = classNotificationRequestRepository;
        this.notificationService = notificationService;
    }

    public List<ClubClass> getAllClasses() {
        return clubClassRepository.findAll();
    }

    public ClubClass getClassById(long id) {
        return clubClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada con id: " + id));
    }

    public List<ClassScheduleItemResponse> getScheduleForUserOnDate(LocalDate classDate, String userEmail) {
        User user = getRequiredUserByEmail(userEmail);

        if (user.getClub() == null) {
            throw new BadRequestException("El usuario no tiene club asignado.");
        }

        LocalDateTime now = LocalDateTime.now();

        return clubClassRepository.findByClubId(user.getClub().getId()).stream()
                .filter(clubClass -> ClubClassScheduleUtils.matchesDate(clubClass, classDate))
                .filter(clubClass -> ClubClassScheduleUtils.getClassStartDateTime(clubClass, classDate).isAfter(now))
                .sorted(Comparator
                        .comparing(clubClass -> ClubClassScheduleUtils.extractStartTime(clubClass.getSchedule())))
                .map(clubClass -> buildScheduleItem(user, clubClass, classDate, now))
                .toList();
    }

    @Transactional
    public NotificationRequestResponse requestAvailabilityNotification(
            Long clubClassId,
            LocalDate classDate,
            String userEmail) {
        User user = getRequiredUserByEmail(userEmail);
        ClubClass clubClass = getRequiredClubClass(clubClassId);

        validateSameClub(user, clubClass);
        validateClassDateMatchesSchedule(clubClass, classDate);

        LocalDateTime bookingOpensAt = ClubClassScheduleUtils.getBookingOpensAt(clubClass, classDate);
        if (!LocalDateTime.now().isBefore(bookingOpensAt)) {
            throw new BadRequestException("La reserva ya está abierta para esta clase.");
        }

        Optional<ClassNotificationRequest> existingRequest = classNotificationRequestRepository
                .findByUserIdAndClubClassIdAndClassDate(
                        user.getId(),
                        clubClass.getId(),
                        classDate);

        ClassNotificationRequest notificationRequest = existingRequest
                .orElseGet(() -> ClassNotificationRequest.builder()
                        .user(user)
                        .clubClass(clubClass)
                        .classDate(classDate)
                        .createdAt(LocalDateTime.now())
                        .active(true)
                        .build());

        notificationRequest.setActive(true);
        notificationRequest.setNotifiedAt(null);

        classNotificationRequestRepository.save(notificationRequest);
        notificationService.createClassReminderRequestedNotification(user, clubClass, classDate);

        return NotificationRequestResponse.builder()
                .clubClassId(clubClassId)
                .classDate(classDate)
                .active(true)
                .message("Notification request saved successfully")
                .build();
    }

    private ClassScheduleItemResponse buildScheduleItem(
            User user,
            ClubClass clubClass,
            LocalDate classDate,
            LocalDateTime now) {
        LocalDateTime bookingOpensAt = ClubClassScheduleUtils.getBookingOpensAt(clubClass, classDate);

        long confirmedCount = bookingRepository.countByClubClassIdAndClassDateAndStatus(
                clubClass.getId(),
                classDate,
                BookingStatus.CONFIRMED);

        long availableSpots = Math.max(0, clubClass.getCapacity() - confirmedCount);

        Optional<Booking> myBookingOpt = bookingRepository.findByUserIdAndClubClassIdAndClassDate(
                user.getId(),
                clubClass.getId(),
                classDate);

        List<Booking> waitlist = bookingRepository.findByClubClassIdAndClassDateAndStatusOrderByCreatedAtAsc(
                clubClass.getId(),
                classDate,
                BookingStatus.WAITLISTED);

        Integer myWaitlistPosition = null;
        if (myBookingOpt.isPresent() && myBookingOpt.get().getStatus() == BookingStatus.WAITLISTED) {
            for (int i = 0; i < waitlist.size(); i++) {
                if (waitlist.get(i).getUser().getId().equals(user.getId())) {
                    myWaitlistPosition = i + 1;
                    break;
                }
            }
        }

        boolean notifyRequested = classNotificationRequestRepository.findByUserIdAndClubClassIdAndClassDate(
                user.getId(),
                clubClass.getId(),
                classDate).map(ClassNotificationRequest::isActive).orElse(false);

        String state;

        if (myBookingOpt.isPresent() && myBookingOpt.get().getStatus() == BookingStatus.CONFIRMED) {
            state = "BOOKED";
        } else if (myBookingOpt.isPresent() && myBookingOpt.get().getStatus() == BookingStatus.WAITLISTED) {
            state = "WAITLISTED";
        } else if (now.isBefore(bookingOpensAt)) {
            state = "BOOKING_NOT_OPEN";
        } else if (availableSpots > 0) {
            state = "AVAILABLE";
        } else {
            state = "FULL_WAITLIST_AVAILABLE";
        }

        return ClassScheduleItemResponse.builder()
                .clubClassId(clubClass.getId())
                .className(clubClass.getName())
                .description(clubClass.getDescription())
                .category(clubClass.getCategory().name())
                .clubName(clubClass.getClub().getName())
                .classDate(classDate)
                .startTime(ClubClassScheduleUtils.extractStartTime(clubClass.getSchedule()).toString())
                .capacity(clubClass.getCapacity())
                .confirmedCount(confirmedCount)
                .availableSpots(availableSpots)
                .bookingOpensAt(bookingOpensAt)
                .state(state)
                .myWaitlistPosition(myWaitlistPosition)
                .notifyRequested(notifyRequested)
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
