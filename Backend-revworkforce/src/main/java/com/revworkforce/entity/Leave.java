// package com.revworkforce.entity;

// import jakarta.persistence.*;
// import java.time.LocalDate;

// @Entity
// @Table(name = "leaves")
// public class Leave {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne
//     @JoinColumn(name = "employee_id", nullable = false)
//     private User employee;

//     @ManyToOne
//     @JoinColumn(name = "manager_id", nullable = false)
//     private User manager;

//     @Column(nullable = false)
//     private String type; // Sick, Casual, etc.

//     @Column(nullable = false)
//     private String status = "PENDING"; // PENDING, APPROVED, REJECTED

//     @Column(nullable = false)
//     private LocalDate startDate;

//     @Column(nullable = false)
//     private LocalDate endDate;

//     private String reason;

//     public Leave() {}

//     // Getters & Setters
//     public Long getId() { return id; }
//     public User getEmployee() { return employee; }
//     public void setEmployee(User employee) { this.employee = employee; }
//     public User getManager() { return manager; }
//     public void setManager(User manager) { this.manager = manager; }
//     public String getType() { return type; }
//     public void setType(String type) { this.type = type; }
//     public String getStatus() { return status; }
//     public void setStatus(String status) { this.status = status; }
//     public LocalDate getStartDate() { return startDate; }
//     public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
//     public LocalDate getEndDate() { return endDate; }
//     public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
//     public String getReason() { return reason; }
//     public void setReason(String reason) { this.reason = reason; }
// }
package com.revworkforce.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leaves")
public class Leave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Employee applying leave
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    // Reporting Manager
    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    // 🔥 NEW: Leave Type (Casual, Sick, Paid)
    @ManyToOne
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    // Leave Status
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, CANCELLED

    // 🔥 NEW: Manager Comment
    private String managerComment;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private String reason;

    public Leave() {
    }

    // ========================
    // Getters & Setters
    // ========================

    public Long getId() {
        return id;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getManagerComment() {
        return managerComment;
    }

    public void setManagerComment(String managerComment) {
        this.managerComment = managerComment;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}