package com.gymentality.backend.repository;

import com.gymentality.backend.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
}
