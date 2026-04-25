package com.gymentality.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassScheduleItemResponse {
    private Long clubClassId;
    private String className;
    private String description;
    private String category;
    private String clubName;

    private LocalDate classDate;
    private String startTime;

    private Integer capacity;
    private long confirmedCount;
    private long availableSpots;

    private LocalDateTime bookingOpensAt;

    /**
     * AVAILABLE
     * BOOKED
     * FULL_WAITLIST_AVAILABLE
     * WAITLISTED
     * BOOKING_NOT_OPEN
     */
    private String state;

    private Integer myWaitlistPosition;
    private boolean notifyRequested;
}