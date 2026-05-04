package com.gymentality.backend.service;

import com.gymentality.backend.dto.NotificationResponse;
import com.gymentality.backend.entity.ClassNotificationRequest;
import com.gymentality.backend.entity.ClubClass;
import com.gymentality.backend.entity.Notification;
import com.gymentality.backend.entity.User;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.exception.UnauthorizedException;
import com.gymentality.backend.repository.ClassNotificationRequestRepository;
import com.gymentality.backend.repository.NotificationRepository;
import com.gymentality.backend.repository.UserRepository;
import com.gymentality.backend.util.ClubClassScheduleUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ClassNotificationRequestRepository classNotificationRequestRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            ClassNotificationRequestRepository classNotificationRequestRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.classNotificationRequestRepository = classNotificationRequestRepository;
    }

    public List<NotificationResponse> getNotifications(String userEmail) {
        User user = getRequiredUserByEmail(userEmail);

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, String userEmail) {
        User user = getRequiredUserByEmail(userEmail);
        Notification notification = getOwnedNotification(notificationId, user);

        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }

        return mapToResponse(notification);
    }

    @Transactional
    public NotificationResponse moveToTrash(Long notificationId, String userEmail) {
        User user = getRequiredUserByEmail(userEmail);
        Notification notification = getOwnedNotification(notificationId, user);

        if (notification.getDeletedAt() == null) {
            LocalDateTime now = LocalDateTime.now();
            notification.setDeletedAt(now);
            notification.setRead(true);
            notification.setReadAt(now);
            notificationRepository.save(notification);
        }

        return mapToResponse(notification);
    }

    @Transactional
    public void createBookingConfirmedNotification(User user, ClubClass clubClass, LocalDate classDate) {
        createNotification(
                user,
                "bookings",
                "Class booking confirmed",
                buildClassEyebrow(clubClass),
                "Your spot for " + clubClass.getName() + " has been reserved successfully.");
    }

    @Transactional
    public void createWaitlistNotification(User user, ClubClass clubClass, LocalDate classDate) {
        createNotification(
                user,
                "bookings",
                "Added to waiting list",
                buildClassEyebrow(clubClass),
                "You have been added to the waiting list for " + clubClass.getName() + ".");
    }

    @Transactional
    public void createBookingCancelledNotification(User user, ClubClass clubClass, LocalDate classDate) {
        createNotification(
                user,
                "bookings",
                "Reservation cancelled",
                buildClassEyebrow(clubClass),
                "Your reservation for " + clubClass.getName() + " has been cancelled successfully.");
    }

    @Transactional
    public void createWaitlistPromotedNotification(User user, ClubClass clubClass, LocalDate classDate) {
        createNotification(
                user,
                "bookings",
                "Spot confirmed",
                buildClassEyebrow(clubClass),
                "A spot opened for " + clubClass.getName() + ". Your booking is now confirmed.");
    }

    @Transactional
    public void createClassReminderRequestedNotification(User user, ClubClass clubClass, LocalDate classDate) {
        createNotification(
                user,
                "classes",
                "Class reminder created",
                buildClassEyebrow(clubClass),
                "We will notify you when " + clubClass.getName() + " opens for booking.");
    }

    @Transactional
    public void createClassBookingOpenNotification(User user, ClubClass clubClass, LocalDate classDate) {
        createNotification(
                user,
                "classes",
                "Class available to book",
                buildClassEyebrow(clubClass),
                clubClass.getName() + " is now open for booking. Reserve your spot now.");
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void notifyOpenClassBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<ClassNotificationRequest> pendingRequests =
                classNotificationRequestRepository.findByActiveTrueAndNotifiedAtIsNull();

        for (ClassNotificationRequest request : pendingRequests) {
            LocalDateTime bookingOpensAt = ClubClassScheduleUtils.getBookingOpensAt(
                    request.getClubClass(),
                    request.getClassDate());

            if (bookingOpensAt.isAfter(now)) {
                continue;
            }

            createClassBookingOpenNotification(
                    request.getUser(),
                    request.getClubClass(),
                    request.getClassDate());
            request.setActive(false);
            request.setNotifiedAt(now);
            classNotificationRequestRepository.save(request);
        }
    }

    private void createNotification(User user, String category, String title, String eyebrow, String message) {
        notificationRepository.save(Notification.builder()
                .user(user)
                .category(category)
                .title(title)
                .eyebrow(eyebrow)
                .message(message)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build());
    }

    private Notification getOwnedNotification(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificacion no encontrada."));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("No puedes modificar esta notificacion.");
        }

        return notification;
    }

    private String buildClassEyebrow(ClubClass clubClass) {
        return clubClass.getName() + " " +
                ClubClassScheduleUtils.extractStartTime(clubClass.getSchedule()).format(TIME_FORMATTER);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .category(notification.getCategory())
                .title(notification.getTitle())
                .eyebrow(notification.getEyebrow())
                .message(notification.getMessage())
                .createdAt(notification.getCreatedAt())
                .read(notification.isRead())
                .deleted(notification.getDeletedAt() != null)
                .deletedAt(notification.getDeletedAt())
                .build();
    }

    private User getRequiredUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new UnauthorizedException("Usuario no autenticado.");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado."));
    }
}
