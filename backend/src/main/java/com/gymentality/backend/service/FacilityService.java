package com.gymentality.backend.service;

import com.gymentality.backend.entity.Facility;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.repository.FacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility getFacilityById(long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instalación no encontrada con id: " + id));
    }
}