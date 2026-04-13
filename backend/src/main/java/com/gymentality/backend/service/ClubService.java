package com.gymentality.backend.service;

import com.gymentality.backend.entity.Club;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.repository.ClubRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubService {

    private final ClubRepository clubRepository;

    public ClubService(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Club getClubById(long id) {
        return clubRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
    }
}
