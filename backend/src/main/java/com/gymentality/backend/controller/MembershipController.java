package com.gymentality.backend.controller;

import com.gymentality.backend.entity.Membership;
import com.gymentality.backend.service.MembershipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping
    public List<Membership> getAllMemberships() {
        return membershipService.getAllMemberships();
    }

    @GetMapping("/{id}")
    public Membership getMembershipById(@PathVariable long id) {
        return membershipService.getMembershipById(id);
    }
}
