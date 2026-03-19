package com.revworkforce.dto;

import java.time.LocalDate;

public class PerformanceDTO {

    private Long id;
    private Long employeeId;
    private Long managerId;
    private String goal;
    private String feedback;
    private Integer rating;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;

    // ✅ Constructors
    public PerformanceDTO() {}

    public PerformanceDTO(Long id, Long employeeId, Long managerId, String goal, String feedback,
                          Integer rating, String status, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.employeeId = employeeId;
        this.managerId = managerId;
        this.goal = goal;
        this.feedback = feedback;
        this.rating = rating;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // ✅ Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}