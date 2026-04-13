package com.gymentality.backend.controller;

import com.gymentality.backend.entity.Club;
import com.gymentality.backend.service.ClubService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @GetMapping
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public Club getClubById(@PathVariable Long id) {
        return clubService.getClubById(id);
    }
}