package com.revworkforce.controller;
import com.revworkforce.entity.LeaveType;
import com.revworkforce.repository.LeaveTypeRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/admin/leave-types")
public class LeaveTypeController {

    private final LeaveTypeRepository repository;

    public LeaveTypeController(LeaveTypeRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public LeaveType create(@RequestBody LeaveType type) {
        return repository.save(type);
    }

    @GetMapping
    public List<LeaveType> getAll() {
        return repository.findAll();
    }
}
