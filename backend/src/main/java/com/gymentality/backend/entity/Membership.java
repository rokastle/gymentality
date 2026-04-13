package com.gymentality.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "memberships")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    @Column(nullable = false)
    @ToString.Include
    private String name;

    @Column(length = 1000)
    @ToString.Include
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    @ToString.Include
    private BigDecimal price;

    @Column(nullable = false)
    @ToString.Include
    private Integer durationInDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ToString.Include
    private MembershipCategory category;
}