package com.gymentality.backend.controller;

import com.gymentality.backend.entity.Facility;
import com.gymentality.backend.service.FacilityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityService.getAllFacilities();
    }

    @GetMapping("/{id}")
    public Facility getFacilityById(@PathVariable long id) {
        return facilityService.getFacilityById(id);
    }
}
