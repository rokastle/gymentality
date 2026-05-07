package com.gymentality.backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.when;

import com.gymentality.backend.config.SecurityConfig;
import com.gymentality.backend.security.CustomUserDetailsService;
import com.gymentality.backend.security.JwtAuthenticationFilter;
import com.gymentality.backend.security.JwtService;
import com.gymentality.backend.service.ClubClassService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ClubClassController.class)
@Import({ SecurityConfig.class, JwtAuthenticationFilter.class })
class ClubClassControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClubClassService clubClassService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllClassesIsPublic() throws Exception {
        when(clubClassService.getAllClasses()).thenReturn(List.of());

        mockMvc.perform(get("/api/classes"))
            .andExpect(status().isOk());
    }

    @Test
    void getScheduleRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/classes/schedule").param("date", "2026-05-06"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getScheduleRejectsInvalidToken() throws Exception {
        when(jwtService.extractUsername("invalid-token"))
            .thenThrow(new IllegalArgumentException("Invalid token"));

        mockMvc.perform(
                get("/api/classes/schedule")
                    .param("date", "2026-05-06")
                    .header("Authorization", "Bearer invalid-token")
            )
            .andExpect(status().isUnauthorized());
    }
}
