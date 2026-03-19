package com.revworkforce.repository;

import com.revworkforce.entity.Leave;
import com.revworkforce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByManagerAndStatus(User manager, String status);
    List<Leave> findByManagerId(Long managerId);
    List<Leave> findByEmployeeId(Long employeeId);
     // Employee ke leaves fetch karne ke liye
    List<Leave> findByEmployee(User employee);
}