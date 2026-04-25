package com.gymentality.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequestResponse {
    private Long clubClassId;
    private LocalDate classDate;
    private boolean active;
    private String message;
}