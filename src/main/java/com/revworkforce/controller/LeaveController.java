// package com.revworkforce.controller;

// import com.revworkforce.dto.LeaveDTO;
// import com.revworkforce.entity.Leave;
// import com.revworkforce.entity.User;
// import com.revworkforce.repository.UserRepository;
// import com.revworkforce.service.LeaveService;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/leaves")
// public class LeaveController {

//     private final LeaveService leaveService;
//     private final UserRepository userRepository;

//     public LeaveController(LeaveService leaveService, UserRepository userRepository) {
//         this.leaveService = leaveService;
//         this.userRepository = userRepository;
//     }

//     // Employee applies leave
//     // @PostMapping
//     // public Leave applyLeave(@RequestBody Leave leave) {
//     // // Optional: fetch employee & manager from DB to ensure they exist
//     // leave.setEmployee(userRepository.findById(leave.getEmployee().getId())
//     // .orElseThrow(() -> new RuntimeException("Employee not found")));
//     // leave.setManager(userRepository.findById(leave.getManager().getId())
//     // .orElseThrow(() -> new RuntimeException("Manager not found")));

//     // return leaveService.applyLeave(leave);
//     // }
//     // Employee applies leave – return LeaveDTO instead of full Leave
//     @PostMapping
//     public LeaveDTO applyLeave(@RequestBody Leave leave) {
//         // Set employee and manager from DB
//         leave.setEmployee(userRepository.findById(leave.getEmployee().getId())
//                 .orElseThrow(() -> new RuntimeException("Employee not found")));
//         leave.setManager(userRepository.findById(leave.getManager().getId())
//                 .orElseThrow(() -> new RuntimeException("Manager not found")));

//         // Save leave
//         Leave savedLeave = leaveService.applyLeave(leave);

//         // Map to LeaveDTO
//         return new LeaveDTO(
//                 savedLeave.getId(),
//                 savedLeave.getEmployee().getFirstName() + " " + savedLeave.getEmployee().getLastName(),
//                 savedLeave.getManager().getFirstName() + " " + savedLeave.getManager().getLastName(),
//                 savedLeave.getType(),
//                 savedLeave.getStatus(),
//                 savedLeave.getStartDate(),
//                 savedLeave.getEndDate(),
//                 savedLeave.getReason());
//     }

//     // Manager fetches pending leaves
//     // @GetMapping("/pending")
//     // public List<Leave> getPendingLeaves(@RequestParam Long managerId) {
//     // User manager = userRepository.findById(managerId)
//     // .orElseThrow(() -> new RuntimeException("Manager not found"));
//     // return leaveService.getPendingLeaves(manager);
//     // }
//     // Manager fetches pending leaves (return clean DTO)
//     @GetMapping("/pending")
//     public List<LeaveDTO> getPendingLeaves(@RequestParam Long managerId) {
//         User manager = userRepository.findById(managerId)
//                 .orElseThrow(() -> new RuntimeException("Manager not found"));
//         List<Leave> pendingLeaves = leaveService.getPendingLeaves(manager);

//         // Map Leave -> LeaveDTO
//         return pendingLeaves.stream().map(leave -> new LeaveDTO(
//                 leave.getId(),
//                 leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName(),
//                 leave.getManager().getFirstName() + " " + leave.getManager().getLastName(),
//                 leave.getType(),
//                 leave.getStatus(),
//                 leave.getStartDate(),
//                 leave.getEndDate(),
//                 leave.getReason())).collect(Collectors.toList());
//     }

//     // // Approve leave
//     // @PutMapping("/{id}/approve")
//     // public Leave approveLeave(@PathVariable Long id) {
//     // return leaveService.approveLeave(id);
//     // }
//     // Approve leave – return LeaveDTO
//     @PutMapping("/{id}/approve")
//     public LeaveDTO approveLeave(@PathVariable Long id) {
//         Leave savedLeave = leaveService.approveLeave(id);

//         return new LeaveDTO(
//                 savedLeave.getId(),
//                 savedLeave.getEmployee().getFirstName() + " " + savedLeave.getEmployee().getLastName(),
//                 savedLeave.getManager().getFirstName() + " " + savedLeave.getManager().getLastName(),
//                 savedLeave.getType(),
//                 savedLeave.getStatus(),
//                 savedLeave.getStartDate(),
//                 savedLeave.getEndDate(),
//                 savedLeave.getReason());
//     }

//     // Reject leave
//     // Reject leave – return LeaveDTO
//     @PutMapping("/{id}/reject")
//     public LeaveDTO rejectLeave(@PathVariable Long id) {
//         Leave savedLeave = leaveService.rejectLeave(id);

//         return new LeaveDTO(
//                 savedLeave.getId(),
//                 savedLeave.getEmployee().getFirstName() + " " + savedLeave.getEmployee().getLastName(),
//                 savedLeave.getManager().getFirstName() + " " + savedLeave.getManager().getLastName(),
//                 savedLeave.getType(),
//                 savedLeave.getStatus(),
//                 savedLeave.getStartDate(),
//                 savedLeave.getEndDate(),
//                 savedLeave.getReason());
//     }
// }
package com.revworkforce.controller;

import com.revworkforce.dto.LeaveDTO;
import com.revworkforce.dto.LeaveRequestDTO;
import com.revworkforce.entity.Leave;
import com.revworkforce.entity.LeaveBalance;
import com.revworkforce.entity.LeaveType;
import com.revworkforce.entity.User;
import com.revworkforce.repository.UserRepository;
import com.revworkforce.service.LeaveService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.revworkforce.service.LeaveService;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import com.revworkforce.repository.LeaveRepository;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

        private final LeaveService leaveService;
        private final UserRepository userRepository;
        private final LeaveRepository leaveRepository;

        public LeaveController(LeaveService leaveService, UserRepository userRepository,
                        LeaveRepository leaveRepository) {
                this.leaveService = leaveService;
                this.userRepository = userRepository;
                this.leaveRepository = leaveRepository;
        }

        // ==============================
        // Employee applies leave
        // ==============================
        @PostMapping
        public LeaveDTO applyLeave(
                        @RequestBody LeaveRequestDTO request,
                        Authentication authentication) {

                // 🔹 Logged-in user ka email
                String email = authentication.getName();

                User employee = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // 🔹 Manager auto set
                User manager = employee.getManager();
                // 🔹 Leave Type
                LeaveType leaveType = leaveService.getLeaveTypeById(request.getLeaveTypeId());

                // 🔹 Calculate requested leave days
                long requestedDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
                // 🔹 Fetch leave balance
                LeaveBalance leaveBalance = leaveService.getLeaveBalance(employee.getId(), leaveType.getId())
                                .orElseThrow(() -> new RuntimeException("Leave balance not found"));

                // 🔹 Check if sufficient quota
                if (requestedDays > (leaveBalance.getTotalQuota() - leaveBalance.getUsedLeaves())) {
                        throw new RuntimeException("Insufficient leave balance. You have " +
                                        (leaveBalance.getTotalQuota() - leaveBalance.getUsedLeaves())
                                        + " days left for " +
                                        leaveType.getName());
                }
                // 🔹 Create Leave object
                Leave leave = new Leave();
                leave.setEmployee(employee);
                leave.setManager(manager);
                leave.setLeaveType(
                                leaveService.getLeaveTypeById(request.getLeaveTypeId()));
                leave.setStartDate(request.getStartDate());
                leave.setEndDate(request.getEndDate());
                leave.setReason(request.getReason());
                leave.setStatus("PENDING");

                Leave savedLeave = leaveService.applyLeave(leave);

                return mapToDTO(savedLeave);
        }

        // ==============================
        // Manager fetches pending leaves
        // ==============================
        @GetMapping("/pending")
        public List<LeaveDTO> getPendingLeaves(@RequestParam Long managerId) {

                User manager = userRepository.findById(managerId)
                                .orElseThrow(() -> new RuntimeException("Manager not found"));

                List<Leave> pendingLeaves = leaveService.getPendingLeaves(manager);

                return pendingLeaves.stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        // ==============================
        // Approve Leave
        // ==============================
        @PutMapping("/{id}/approve")
        public LeaveDTO approveLeave(
                        @PathVariable Long id,
                        @RequestParam Long managerId) {

                Leave savedLeave = leaveService.approveLeave(id, managerId);

                return mapToDTO(savedLeave);
        }

        // ==============================
        // Reject Leave (with comment)
        // ==============================
        @PutMapping("/{id}/reject")
        public LeaveDTO rejectLeave(@PathVariable Long id,
                        @RequestParam String comment) {

                Leave savedLeave = leaveService.rejectLeave(id, comment);

                return mapToDTO(savedLeave);
        }

        // ==============================
        // Cancel Leave (Employee)
        // ==============================
        @PutMapping("/{id}/cancel")
        public LeaveDTO cancelLeave(@PathVariable Long id) {

                Leave savedLeave = leaveService.cancelLeave(id);

                return mapToDTO(savedLeave);
        }

        // ==============================
        // Common DTO Mapper
        // ==============================
        private LeaveDTO mapToDTO(Leave leave) {
                return new LeaveDTO(
                                leave.getId(),
                                leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName(),
                                leave.getManager() != null
                                                ? leave.getManager().getFirstName() + " "
                                                                + leave.getManager().getLastName()
                                                : null,
                                leave.getLeaveType().getName(),
                                leave.getStatus(),
                                leave.getStartDate(),
                                leave.getEndDate(),
                                leave.getReason());
        }

        @GetMapping("/team")
        public List<LeaveDTO> teamLeaves(@RequestParam Long managerId) {

                List<Leave> leaves = leaveService.getTeamLeaves(managerId);

                return leaves.stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        @GetMapping("/report")
        public List<LeaveDTO> getMyLeaves(Authentication authentication) {
                String email = authentication.getName();
                User employee = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Leave> leaves = leaveRepository.findByEmployee(employee);
                return leaves.stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        @GetMapping("/all")
        public List<LeaveDTO> getAllLeavesForAdmin() {
                List<Leave> leaves = leaveService.getAllLeaves();
                return leaves.stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        // ==============================
        // Get leaves applied by a specific employee (by ID)
        // Useful for Admin / Manager views
        // GET /api/leaves/employee/{employeeId}
        // ==============================
        @GetMapping("/employee/{employeeId}")
        public List<LeaveDTO> getLeavesByEmployee(@PathVariable Long employeeId) {
                List<Leave> leaves = leaveService.getLeavesByEmployee(employeeId);
                return leaves.stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        // ==============================
        // Get my own leaves (authenticated employee)
        // GET /api/leaves/my
        // ==============================
        @GetMapping("/my")
        public List<LeaveDTO> getMyOwnLeaves(Authentication authentication) {
                String email = authentication.getName();
                User employee = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                List<Leave> leaves = leaveRepository.findByEmployee(employee);
                return leaves.stream()
                                .map(this::mapToDTO)
                                .toList();
        }
}