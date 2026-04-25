package com.gymentality.backend.service;

import com.gymentality.backend.entity.WorkoutPlan;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.repository.WorkoutPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;

    public WorkoutPlanService(WorkoutPlanRepository workoutPlanRepository) {
        this.workoutPlanRepository = workoutPlanRepository;
    }

    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanRepository.findAll();
    }

    public WorkoutPlan getWorkoutPlanById(long id) {
        return workoutPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan de entrenamiento no encontrado con id: " + id));
    }
}