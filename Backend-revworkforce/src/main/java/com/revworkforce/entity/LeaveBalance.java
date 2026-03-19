package com.revworkforce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_balances")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer totalQuota;

    @Column(nullable = false)
    private Integer usedLeaves = 0;

    // Constructors
    public LeaveBalance() {
    }

    public LeaveBalance(User employee, LeaveType leaveType, Integer totalQuota) {
        this.employee = employee;
        this.leaveType = leaveType;
        this.totalQuota = totalQuota;
        this.usedLeaves = 0;
    }

    // Business Logic
    public Integer getRemainingLeaves() {
        return totalQuota - usedLeaves;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public User getEmployee() {
        return employee;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public Integer getTotalQuota() {
        return totalQuota;
    }

    public Integer getUsedLeaves() {
        return usedLeaves;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public void setTotalQuota(Integer totalQuota) {
        this.totalQuota = totalQuota;
    }

    public void setUsedLeaves(Integer usedLeaves) {
        this.usedLeaves = usedLeaves;
    }
}

