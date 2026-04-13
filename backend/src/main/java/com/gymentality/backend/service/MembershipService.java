package com.gymentality.backend.service;

import com.gymentality.backend.entity.Membership;
import com.gymentality.backend.exception.ResourceNotFoundException;
import com.gymentality.backend.repository.MembershipRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;

    public MembershipService(MembershipRepository membershipRepository) {
        this.membershipRepository = membershipRepository;
    }

    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    public Membership getMembershipById(long id) {
        return membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membresía no encontrada con id: " + id));
    }
}
