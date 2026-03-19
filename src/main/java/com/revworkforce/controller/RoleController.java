package com.revworkforce.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.revworkforce.entity.Role;
import com.revworkforce.repository.RoleRepository;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Create Role
    @PostMapping
    public Role createRole(@RequestBody Role role) {
        return roleRepository.save(role);
    }

    // Get All Roles
    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}