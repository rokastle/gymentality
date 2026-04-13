package com.gymentality.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clubs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    @Column(nullable = false)
    @ToString.Include
    private String name;

    @Column(nullable = false)
    @ToString.Include
    private String address;

    @Column(nullable = false)
    @ToString.Include
    private String city;

    @ToString.Include
    private String phone;

    @ToString.Include
    private String email;

    @Column(length = 1000)
    @ToString.Include
    private String description;
}