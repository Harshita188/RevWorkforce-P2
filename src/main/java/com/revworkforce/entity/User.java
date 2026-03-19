package com.revworkforce.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Set;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;
    
    @JsonIgnore
    private String password;

    // 🔹 Many users can have same role
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    // 🔹 Many users can belong to same department
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // 🔹 Many users can have same designation
    @ManyToOne
    @JoinColumn(name = "designation_id")
    private Designation designation;
    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonBackReference
    private User manager;

    @OneToMany(mappedBy = "manager")
    @JsonManagedReference
    private List<User> reportees = new ArrayList<>();

    public User() {
    }

    // getters & setters

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public Department getDepartment() {
        return department;
    }

    public Designation getDesignation() {
        return designation;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public void setDesignation(Designation designation) {
        this.designation = designation;
    }

    // Getter & Setter
    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public List<User> getReportees() {
        return reportees;
    }

    public void setReportees(List<User> reportees) {
        this.reportees = reportees;
    }
}