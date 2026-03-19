// package com.revworkforce.service;

// import com.revworkforce.entity.Leave;
// import com.revworkforce.entity.User;
// import com.revworkforce.repository.LeaveRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class LeaveService {

//     private final LeaveRepository leaveRepository;

//     public LeaveService(LeaveRepository leaveRepository) {
//         this.leaveRepository = leaveRepository;
//     }

//     // Employee applies leave
//     public Leave applyLeave(Leave leave) {
//         return leaveRepository.save(leave);
//     }

//     // Manager fetches pending leaves
//     public List<Leave> getPendingLeaves(User manager) {
//         return leaveRepository.findByManagerAndStatus(manager, "PENDING");
//     }

//     // Approve leave
//     public Leave approveLeave(Long leaveId) {
//         Leave leave = leaveRepository.findById(leaveId)
//                 .orElseThrow(() -> new RuntimeException("Leave not found with id: " + leaveId));
//         leave.setStatus("APPROVED");
//         return leaveRepository.save(leave);
//     }

//     // Reject leave
//     public Leave rejectLeave(Long leaveId) {
//         Leave leave = leaveRepository.findById(leaveId)
//                 .orElseThrow(() -> new RuntimeException("Leave not found with id: " + leaveId));
//         leave.setStatus("REJECTED");
//         return leaveRepository.save(leave);
//     }
// }

package com.revworkforce.service;

import com.revworkforce.entity.Leave;
import com.revworkforce.entity.LeaveBalance;
import com.revworkforce.entity.LeaveType;
import com.revworkforce.entity.User;
import com.revworkforce.repository.LeaveBalanceRepository;
import com.revworkforce.repository.LeaveRepository;
import org.springframework.stereotype.Service;
import com.revworkforce.repository.LeaveTypeRepository;
import com.revworkforce.repository.UserRepository;

import java.util.Optional;
import java.time.temporal.ChronoUnit;
import java.util.List;
import com.revworkforce.service.LeaveService;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final UserRepository userRepository;
    public LeaveService(LeaveRepository leaveRepository,
            LeaveBalanceRepository leaveBalanceRepository,
            LeaveTypeRepository leaveTypeRepository,
            UserRepository userRepository) {

        this.leaveRepository = leaveRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.userRepository = userRepository; 
    }

    // 🔹 Ye method add kar do yaha, baki methods ke saath hi
    public Optional<LeaveBalance> getLeaveBalance(Long employeeId, Long leaveTypeId) {
        return leaveBalanceRepository.findByEmployeeIdAndLeaveTypeId(employeeId, leaveTypeId);
    }

    // ===============================
    // 1️⃣ Employee Applies Leave
    // ===============================
    public Leave applyLeave(Leave leave) {

        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeId(
                        leave.getEmployee().getId(),
                        leave.getLeaveType().getId())
                .orElseThrow(() -> new RuntimeException("Leave balance not configured for this employee"));

        if (balance.getRemainingLeaves() <= 0) {
            throw new RuntimeException("No leave balance remaining");
        }

        leave.setStatus("PENDING");
        return leaveRepository.save(leave);
    }

    // ===============================
    // 2️⃣ Manager Fetch Pending Leaves
    // ===============================
    public List<Leave> getPendingLeaves(User manager) {
        return leaveRepository.findByManagerAndStatus(manager, "PENDING");
    }

    // ===============================
    // 3️⃣ Approve Leave (Deduct Balance)
    // ===============================
    // public Leave approveLeave(Long leaveId) {

    // Leave leave = leaveRepository.findById(leaveId)
    // .orElseThrow(() -> new RuntimeException("Leave not found with id: " +
    // leaveId));

    // if (!leave.getStatus().equals("PENDING")) {
    // throw new RuntimeException("Only pending leaves can be approved");
    // }

    // LeaveBalance balance = leaveBalanceRepository
    // .findByEmployeeIdAndLeaveTypeId(
    // leave.getEmployee().getId(),
    // leave.getLeaveType().getId())
    // .orElseThrow(() -> new RuntimeException("Leave balance not found"));

    // balance.setUsedLeaves(balance.getUsedLeaves() + 1);

    // leave.setStatus("APPROVED");

    // leaveBalanceRepository.save(balance);
    // return leaveRepository.save(leave);
    // }
    public Leave approveLeave(Long leaveId, Long managerId) {

        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found with id: " + leaveId));

        if (!leave.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only pending leaves can be approved");
        }
        // ✅ 2. SECURITY CHECK (YAHI LAGANA THA)
        if (!leave.getManager().getId().equals(managerId)) {
            throw new RuntimeException("You are not authorized to approve this leave");
        }
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeId(
                        leave.getEmployee().getId(),
                        leave.getLeaveType().getId())
                .orElseThrow(() -> new RuntimeException("Leave balance not found"));

        // 🔥 NEW: Calculate number of leave days
        long days = ChronoUnit.DAYS.between(
                leave.getStartDate(),
                leave.getEndDate()) + 1;

        if (balance.getRemainingLeaves() < days) {
            throw new RuntimeException("Not enough leave balance");
        }

        balance.setUsedLeaves(balance.getUsedLeaves() + (int) days);

        leave.setStatus("APPROVED");

        leaveBalanceRepository.save(balance);
        return leaveRepository.save(leave);
    }

    // ===============================
    // 4️⃣ Reject Leave (Mandatory Comment)
    // ===============================
    public Leave rejectLeave(Long leaveId, String comment) {

        if (comment == null || comment.trim().isEmpty()) {
            throw new RuntimeException("Manager comment is mandatory for rejection");
        }

        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found with id: " + leaveId));

        if (!leave.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only pending leaves can be rejected");
        }

        leave.setStatus("REJECTED");
        leave.setManagerComment(comment);

        return leaveRepository.save(leave);
    }

    // ===============================
    // 5️⃣ Cancel Leave (Employee)
    // ===============================
    // public Leave cancelLeave(Long leaveId) {

    // Leave leave = leaveRepository.findById(leaveId)
    // .orElseThrow(() -> new RuntimeException("Leave not found with id: " +
    // leaveId));

    // if (!leave.getStatus().equals("PENDING")) {
    // throw new RuntimeException("Only pending leaves can be cancelled");
    // }

    // leave.setStatus("CANCELLED");

    // return leaveRepository.save(leave);
    // }
    public Leave cancelLeave(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        if (!leave.getStatus().equals("PENDING") && !leave.getStatus().equals("APPROVED")) {
            throw new RuntimeException("Only pending or approved leaves can be cancelled");
        }

        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeId(leave.getEmployee().getId(), leave.getLeaveType().getId())
                .orElseThrow(() -> new RuntimeException("Leave balance not found"));

        long days = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
        if (leave.getStatus().equals("APPROVED")) {
            balance.setUsedLeaves(balance.getUsedLeaves() - (int) days);
            leaveBalanceRepository.save(balance);
        }

        leave.setStatus("CANCELLED");
        return leaveRepository.save(leave);
    }

    // Team leaves (manager ke reportees ki leaves)
    public List<Leave> getTeamLeaves(Long managerId) {
        return leaveRepository.findByManagerId(managerId);
    }

    // Full leave report (Admin)
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // get leave by id
    public LeaveType getLeaveTypeById(Long id) {
        return leaveTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave type not found"));
    }

    // LeaveService.java
    public List<Leave> getLeavesByEmployee(Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return leaveRepository.findByEmployee(employee);
    }
}