package com.gymentality.backend.repository;

import com.gymentality.backend.entity.Booking;
import com.gymentality.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByUserIdAndClubClassIdAndClassDate(
            Long userId,
            Long clubClassId,
            LocalDate classDate
    );

    long countByClubClassIdAndClassDateAndStatus(
            Long clubClassId,
            LocalDate classDate,
            BookingStatus status
    );

    List<Booking> findByUserIdAndClassDateGreaterThanEqualAndStatusIn(
            Long userId,
            LocalDate classDate,
            List<BookingStatus> statuses
    );

    List<Booking> findByClubClassIdAndClassDateAndStatusOrderByCreatedAtAsc(
            Long clubClassId,
            LocalDate classDate,
            BookingStatus status
    );
}
