package com.revworkforce.service;

import com.revworkforce.entity.Performance;
import com.revworkforce.entity.PerformanceStatus;
import com.revworkforce.repository.PerformanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerformanceService {

    private final PerformanceRepository repository;

    public PerformanceService(PerformanceRepository repository) {
        this.repository = repository;
    }

    public Performance createPerformance(Performance p) {
        return repository.save(p);
    }

    public Performance updatePerformance(Performance p) {
        return repository.save(p);
    }

    public List<Performance> getPendingByManager(Long managerId) {
        return repository.findByManagerIdAndStatus(managerId, PerformanceStatus.PENDING);
    }

    public List<Performance> getByEmployee(Long employeeId) {
        return repository.findByEmployeeId(employeeId);
    }
}