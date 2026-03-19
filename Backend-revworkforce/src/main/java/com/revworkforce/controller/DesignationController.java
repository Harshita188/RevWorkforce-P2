package com.revworkforce.controller;

import com.revworkforce.entity.Designation;
import com.revworkforce.service.DesignationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
public class DesignationController {

    private final DesignationService designationService;

    public DesignationController(DesignationService designationService) {
        this.designationService = designationService;
    }

    @PostMapping
    public Designation create(@RequestBody Designation designation) {
        return designationService.save(designation);
    }

    @GetMapping
    public List<Designation> getAll() {
        return designationService.findAll();
    }
}