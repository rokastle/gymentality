package com.gymentality.backend.repository;

import com.gymentality.backend.entity.ClassNotificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ClassNotificationRequestRepository extends JpaRepository<ClassNotificationRequest, Long> {

    Optional<ClassNotificationRequest> findByUserIdAndClubClassIdAndClassDate(
        Long userId,
        Long clubClassId,
        LocalDate classDate
    );

    List<ClassNotificationRequest> findByClubClassIdAndClassDateAndActiveTrue(
        Long clubClassId,
        LocalDate classDate
    );
}