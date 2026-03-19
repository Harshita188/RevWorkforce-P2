package com.revworkforce.security;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String name;
    private String email;
    private String role;
    private Long id;

    public AuthResponse(String token, String name, String email, String role, Long id) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
    public Long getId() {
        return id;
    }
}
