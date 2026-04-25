package com.gymentality.backend.dto;

import com.gymentality.backend.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpcomingBookingResponse {
    private Long bookingId;
    private Long clubClassId;
    private String className;
    private String category;
    private String clubName;
    private LocalDate classDate;
    private String startTime;
    private BookingStatus status;
    private Integer waitlistPosition;
}