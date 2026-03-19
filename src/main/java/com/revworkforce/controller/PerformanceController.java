// package com.revworkforce.controller;

// import com.revworkforce.dto.PerformanceDTO;
// import com.revworkforce.entity.Performance;
// import com.revworkforce.service.PerformanceService;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/performance")
// public class PerformanceController {

//     private final PerformanceService service;

//     public PerformanceController(PerformanceService service) {
//         this.service = service;
//     }

//     // Employee applies performance goal
//     @PostMapping
//     public Performance create(@RequestBody Performance p) {
//         return service.createPerformance(p);
//     }

//     // Manager reviews performance (update feedback & rating)
//     @PutMapping("/{id}/review")
//     public Performance review(@PathVariable Long id, @RequestBody Performance updated) {
//         Performance existing = service.updatePerformance(updated);
//         existing.setStatus(updated.getStatus());
//         existing.setFeedback(updated.getFeedback());
//         existing.setRating(updated.getRating());
//         return service.updatePerformance(existing);
//     }

//     // Manager views pending reviews
//     // @GetMapping("/pending")
//     // public List<Performance> pending(@RequestParam Long managerId) {
//     // return service.getPendingByManager(managerId);
//     // }
//     @GetMapping("/pending")
//     public List<PerformanceDTO> pending(@RequestParam Long managerId) {
//         List<Performance> list = service.getPendingByManager(managerId);
//         return list.stream().map(p -> {
//             PerformanceDTO dto = new PerformanceDTO();
//             dto.setId(p.getId());
//             dto.setEmployeeId(p.getEmployee().getId());
//             dto.setManagerId(p.getManager().getId());
//             dto.setGoal(p.getGoal());
//             dto.setFeedback(p.getFeedback());
//             dto.setRating(p.getRating());
//             dto.setStatus(p.getStatus().name());
//             dto.setStartDate(p.getStartDate());
//             dto.setEndDate(p.getEndDate());
//             return dto;
//         }).toList();
//     }

//     // Employee views own performance
//     @GetMapping("/my")
//     public List<Performance> myPerformance(@RequestParam Long employeeId) {
//         return service.getByEmployee(employeeId);
//     }
// }
package com.revworkforce.controller;

import com.revworkforce.dto.PerformanceDTO;
import com.revworkforce.entity.Performance;
import com.revworkforce.entity.PerformanceStatus;
import com.revworkforce.entity.User;
import com.revworkforce.repository.PerformanceRepository;
import com.revworkforce.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceRepository performanceRepository;
    private final UserRepository userRepository;

    public PerformanceController(PerformanceRepository performanceRepository, UserRepository userRepository) {
        this.performanceRepository = performanceRepository;
        this.userRepository = userRepository;
    }

    // 1️⃣ Employee submits performance goal
    @PostMapping
    public PerformanceDTO create(@RequestBody PerformanceDTO dto) {
        User employee = userRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        User manager = userRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        // ✅ Duplicate check: agar same employee ka same goal already pending ya
        // reviewed hai
        boolean exists = performanceRepository.existsByEmployeeIdAndGoal(dto.getEmployeeId(), dto.getGoal());
        if (exists) {
            throw new RuntimeException("Goal already exists for this employee!");
        }
        Performance performance = new Performance();
        performance.setEmployee(employee);
        performance.setManager(manager);
        performance.setGoal(dto.getGoal());
        performance.setStartDate(dto.getStartDate());
        performance.setEndDate(dto.getEndDate());
        performance.setStatus(PerformanceStatus.PENDING);

        Performance saved = performanceRepository.save(performance);
        return mapToDTO(saved);
    }

    // 2️⃣ Manager views pending reviews
    @GetMapping("/pending")
    public List<PerformanceDTO> getPendingByManager(@RequestParam Long managerId) {
        List<Performance> list = performanceRepository.findByManagerIdAndStatus(managerId, PerformanceStatus.PENDING);
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // 3️⃣ Manager reviews & provides feedback
    @PutMapping("/{id}/review")
    public PerformanceDTO review(@PathVariable Long id, @RequestBody PerformanceDTO dto) {
        Performance performance = performanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Performance not found"));

        performance.setFeedback(dto.getFeedback());
        performance.setRating(dto.getRating());
        performance.setStatus(PerformanceStatus.REVIEWED);

        Performance saved = performanceRepository.save(performance);
        return mapToDTO(saved);
    }

    // 4️⃣ Employee views their own performances
    @GetMapping("/my")
    public List<PerformanceDTO> getByEmployee(@RequestParam Long employeeId) {
        List<Performance> list = performanceRepository.findByEmployeeId(employeeId);
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // ✅ Utility: map Performance entity to DTO
    private PerformanceDTO mapToDTO(Performance p) {
        PerformanceDTO dto = new PerformanceDTO();
        dto.setId(p.getId());
        dto.setEmployeeId(p.getEmployee().getId());
        dto.setManagerId(p.getManager().getId());
        dto.setGoal(p.getGoal());
        dto.setFeedback(p.getFeedback());
        dto.setRating(p.getRating());
        dto.setStatus(p.getStatus().name());
        dto.setStartDate(p.getStartDate());
        dto.setEndDate(p.getEndDate());
        return dto;
    }
}