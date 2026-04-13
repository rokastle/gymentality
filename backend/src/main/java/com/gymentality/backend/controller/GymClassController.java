package com.gymentality.backend.controller;

import com.gymentality.backend.entity.GymClass;
import com.gymentality.backend.service.GymClassService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class GymClassController {

    private final GymClassService gymClassService;

    public GymClassController(GymClassService gymClassService) {
        this.gymClassService = gymClassService;
    }

    @GetMapping
    public List<GymClass> getAllClasses() {
        return gymClassService.getAllClasses();
    }

    @GetMapping("/{id}")
    public GymClass getClassById(@PathVariable long id) {
        return gymClassService.getClassById(id);
    }
}
