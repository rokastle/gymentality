package com.gymentality.backend.repository;

import com.gymentality.backend.entity.GymClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GymClassRepository extends JpaRepository<GymClass, Long> {
}