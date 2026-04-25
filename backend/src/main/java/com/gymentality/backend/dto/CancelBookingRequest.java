package com.gymentality.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CancelBookingRequest {

    @NotNull
    private Long clubClassId;

    @NotNull
    private LocalDate classDate;
}