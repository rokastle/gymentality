package com.gymentality.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateBookingRequest {

    @NotNull
    private Long clubClassId;

    @NotNull
    private LocalDate classDate;
}