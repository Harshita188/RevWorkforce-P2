package com.revworkforce.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "performance")
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User employee;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    private String goal;
    private String feedback;
    private Integer rating;

    @Enumerated(EnumType.STRING)
    private PerformanceStatus status = PerformanceStatus.PENDING;

    private LocalDate startDate;
    private LocalDate endDate;

    // Constructors
    public Performance() {}

    public Performance(User employee, User manager, String goal, LocalDate startDate, LocalDate endDate) {
        this.employee = employee;
        this.manager = manager;
        this.goal = goal;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = PerformanceStatus.PENDING;
    }

    // Getters & Setters

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

    public PerformanceStatus getStatus() {
        return status;
    }

    public void setStatus(PerformanceStatus status) {
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