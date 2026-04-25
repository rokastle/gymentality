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
public class BookingActionResponse {
    private Long clubClassId;
    private LocalDate classDate;
    private BookingStatus bookingStatus;
    private String message;
}