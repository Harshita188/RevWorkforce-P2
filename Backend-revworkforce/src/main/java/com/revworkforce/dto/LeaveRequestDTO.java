package com.revworkforce.dto;

import java.time.LocalDate;

public class LeaveRequestDTO {

    private Long leaveTypeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;

    // 🔹 Default Constructor
    public LeaveRequestDTO() {
    }

    // 🔹 All Arguments Constructor (optional but useful)
    public LeaveRequestDTO(Long leaveTypeId, LocalDate startDate, LocalDate endDate, String reason) {
        this.leaveTypeId = leaveTypeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
    }

    // 🔹 Getters and Setters

    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
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