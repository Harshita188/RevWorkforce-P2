package com.revworkforce.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "leave_types")
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // Casual, Sick, Paid

    @Column(nullable = false)
    private Integer defaultQuota;

    // Constructors
    public LeaveType() {
    }

    public LeaveType(String name, Integer defaultQuota) {
        this.name = name;
        this.defaultQuota = defaultQuota;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getDefaultQuota() {
        return defaultQuota;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDefaultQuota(Integer defaultQuota) {
        this.defaultQuota = defaultQuota;
    }
}
