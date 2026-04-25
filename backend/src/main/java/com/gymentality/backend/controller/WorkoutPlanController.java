package com.gymentality.backend.controller;

import com.gymentality.backend.entity.WorkoutPlan;
import com.gymentality.backend.service.WorkoutPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout-plans")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
        this.workoutPlanService = workoutPlanService;
    }

    @GetMapping
    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanService.getAllWorkoutPlans();
    }

    @GetMapping("/{id}")
    public WorkoutPlan getWorkoutPlanById(@PathVariable long id) {
        return workoutPlanService.getWorkoutPlanById(id);
    }
}
