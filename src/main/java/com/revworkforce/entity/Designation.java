package com.revworkforce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "designations")
public class Designation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
    public Designation() {}

    public Designation(String title) {
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

     public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}