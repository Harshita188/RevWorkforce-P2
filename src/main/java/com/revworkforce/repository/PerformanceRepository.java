package com.revworkforce.repository;

import com.revworkforce.entity.Performance;
import com.revworkforce.entity.PerformanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    List<Performance> findByManagerIdAndStatus(Long managerId, PerformanceStatus status);

    List<Performance> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeIdAndGoal(Long employeeId, String goal);
}