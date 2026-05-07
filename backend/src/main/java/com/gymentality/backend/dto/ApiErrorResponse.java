package com.gymentality.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private final LocalDateTime timestamp;
    private final int status;
    private final String error;
    private final String message;
    private final Map<String, String> fields;

    private ApiErrorResponse(
        HttpErrorBuilder builder
    ) {
        this.timestamp = LocalDateTime.now();
        this.status = builder.status;
        this.error = builder.error;
        this.message = builder.message;
        this.fields = builder.fields;
    }

    public static ApiErrorResponse of(int status, String error, String message) {
        return new HttpErrorBuilder(status, error, message).build();
    }

    public static ApiErrorResponse validation(
        int status,
        String error,
        String message,
        Map<String, String> fields
    ) {
        return new HttpErrorBuilder(status, error, message)
            .fields(fields)
            .build();
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public Map<String, String> getFields() {
        return fields;
    }

    private static class HttpErrorBuilder {
        private final int status;
        private final String error;
        private final String message;
        private Map<String, String> fields;

        private HttpErrorBuilder(int status, String error, String message) {
            this.status = status;
            this.error = error;
            this.message = message;
        }

        private HttpErrorBuilder fields(Map<String, String> fields) {
            this.fields = fields;
            return this;
        }

        private ApiErrorResponse build() {
            return new ApiErrorResponse(this);
        }
    }
}
