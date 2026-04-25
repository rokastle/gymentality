package com.gymentality.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "club_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class ClubClass {

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

    @Column(nullable = false)
    @ToString.Include
    private String schedule;

    @Column(nullable = false)
    @ToString.Include
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ToString.Include
    private ClubClassCategory category;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
}