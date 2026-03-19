package com.revworkforce.dto;

import java.time.LocalDate;

public class LeaveDTO {

    private Long id;
    private String employeeName;
    private String managerName;
    private String type;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;

    public LeaveDTO() {}

    public LeaveDTO(Long id, String employeeName, String managerName, String type,
                    String status, LocalDate startDate, LocalDate endDate, String reason) {
        this.id = id;
        this.employeeName = employeeName;
        this.managerName = managerName;
        this.type = type;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getEmployeeName() { return employeeName; }
    public String getManagerName() { return managerName; }
    public String getType() { return type; }
    public String getStatus() { return status; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getReason() { return reason; }

    public void setId(Long id) { this.id = id; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public void setType(String type) { this.type = type; }
    public void setStatus(String status) { this.status = status; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setReason(String reason) { this.reason = reason; }
}