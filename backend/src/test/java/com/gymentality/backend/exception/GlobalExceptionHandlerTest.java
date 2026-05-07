package com.gymentality.backend.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.gymentality.backend.dto.ApiErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void emailAlreadyExistsUsesStandardErrorResponse() {
        var response = handler.handleEmailAlreadyExists(
            new EmailAlreadyExistsException("Email already exists")
        );

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());

        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals(409, body.getStatus());
        assertEquals("Conflict", body.getError());
        assertEquals("Email already exists", body.getMessage());
    }

    @Test
    void badRequestUsesStandardErrorResponse() {
        var response = handler.handleBadRequest(
            new BadRequestException("Card expiry month is invalid")
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals(400, body.getStatus());
        assertEquals("Bad Request", body.getError());
        assertEquals("Card expiry month is invalid", body.getMessage());
    }
}
