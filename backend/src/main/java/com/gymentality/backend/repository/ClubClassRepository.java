package com.gymentality.backend.repository;

import com.gymentality.backend.entity.ClubClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClubClassRepository extends JpaRepository<ClubClass, Long> {
    List<ClubClass> findByClubId(Long clubId);
}