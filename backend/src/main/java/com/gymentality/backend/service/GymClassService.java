package com.gymentality.backend.service;

import com.gymentality.backend.entity.GymClass;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.repository.GymClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GymClassService {

    private final GymClassRepository gymClassRepository;

    public GymClassService(GymClassRepository gymClassRepository) {
        this.gymClassRepository = gymClassRepository;
    }

    public List<GymClass> getAllClasses() {
        return gymClassRepository.findAll();
    }

    public GymClass getClassById(long id) {
        return gymClassRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada con id: " + id));
    }
}