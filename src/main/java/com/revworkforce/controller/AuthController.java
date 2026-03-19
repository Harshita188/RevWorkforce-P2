package com.revworkforce.controller;

import com.revworkforce.security.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

//@CrossOrigin(origins = "http://localhost:4200") // Adjust the origin as needed
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
            JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody AuthRequest request) {

    // authenticationManager.authenticate(
    // new UsernamePasswordAuthenticationToken(
    // request.getEmail(),
    // request.getPassword()
    // )
    // );
    // CustomUserDetails userDetails = (CustomUserDetails)
    // authenticationManager.getPrincipal();

    // String role = userDetails.getAuthorities().iterator().next().getAuthority();

    // String token = jwtUtil.generateToken(userDetails.getUsername(), role);
    // //String token = jwtUtil.generateToken(request.getEmail());

    // return ResponseEntity.ok(new AuthResponse(token));
    // }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String role = userDetails.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        String token = jwtUtil.generateToken(userDetails.getUsername(), role);

        return ResponseEntity.ok(new AuthResponse(
                token,
                userDetails.getFullName(),
                userDetails.getEmail(),
                role));
    }
}
