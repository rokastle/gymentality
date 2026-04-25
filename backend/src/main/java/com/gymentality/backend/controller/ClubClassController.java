package com.gymentality.backend.controller;

import com.gymentality.backend.dto.ClassScheduleItemResponse;
import com.gymentality.backend.dto.NotificationRequestResponse;
import com.gymentality.backend.dto.NotifyClassAvailabilityRequest;
import com.gymentality.backend.entity.ClubClass;
import com.gymentality.backend.service.ClubClassService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClubClassController {

    private final ClubClassService clubClassService;

    public ClubClassController(ClubClassService clubClassService) {
        this.clubClassService = clubClassService;
    }

    @GetMapping
    public List<ClubClass> getAllClasses() {
        return clubClassService.getAllClasses();
    }

    @GetMapping("/{id}")
    public ClubClass getClassById(@PathVariable long id) {
        return clubClassService.getClassById(id);
    }

    @GetMapping("/schedule")
    public List<ClassScheduleItemResponse> getScheduleForDate(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        Principal principal
    ) {
        return clubClassService.getScheduleForUserOnDate(date, principal.getName());
    }

    @PostMapping("/{id}/notify")
    public NotificationRequestResponse requestAvailabilityNotification(
        @PathVariable Long id,
        @Valid @RequestBody NotifyClassAvailabilityRequest request,
        Principal principal
    ) {
        return clubClassService.requestAvailabilityNotification(
            id,
            request.getClassDate(),
            principal.getName()
        );
    }
}