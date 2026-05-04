package com.gymentality.backend.controller;

import com.gymentality.backend.dto.NotificationResponse;
import com.gymentality.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications(Principal principal) {
        return notificationService.getNotifications(principal.getName());
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id, Principal principal) {
        return notificationService.markAsRead(id, principal.getName());
    }

    @DeleteMapping("/{id}")
    public NotificationResponse moveToTrash(@PathVariable Long id, Principal principal) {
        return notificationService.moveToTrash(id, principal.getName());
    }
}
