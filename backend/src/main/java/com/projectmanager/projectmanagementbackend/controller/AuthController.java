package com.projectmanager.projectmanagementbackend.controller;

import com.projectmanager.projectmanagementbackend.dto.request.LoginRequest;
import com.projectmanager.projectmanagementbackend.dto.request.RegisterRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ApiResponse;
import com.projectmanager.projectmanagementbackend.dto.response.LoginResponse;
import com.projectmanager.projectmanagementbackend.exception.EmailAlreadyExistsException;
import com.projectmanager.projectmanagementbackend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5175")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        try {
            // Service handles registration, duplicate email, password encoding, JWT
            String token = authService.register(request);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "User registered successfully", token)
            );
        } catch (EmailAlreadyExistsException e) {
            // Return consistent API response for duplicates
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody LoginRequest request
    ) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful", response)
        );
    }
}
