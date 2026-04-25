package com.gymentality.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "class_notification_requests",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "gym_class_id", "class_date"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class ClassNotificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    @Column(name = "class_date", nullable = false)
    @ToString.Include
    private LocalDate classDate;

    @Column(name = "created_at", nullable = false)
    @ToString.Include
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "notified_at")
    private LocalDateTime notifiedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gym_class_id", nullable = false)
    private ClubClass clubClass;
}