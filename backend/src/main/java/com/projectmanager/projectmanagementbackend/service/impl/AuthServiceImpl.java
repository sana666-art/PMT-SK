package com.projectmanager.projectmanagementbackend.service.impl;

import com.projectmanager.projectmanagementbackend.dto.request.LoginRequest;
import com.projectmanager.projectmanagementbackend.dto.request.RegisterRequest;
import com.projectmanager.projectmanagementbackend.dto.response.LoginResponse;
import com.projectmanager.projectmanagementbackend.entity.enums.Role;
import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.exception.EmailAlreadyExistsException;
import com.projectmanager.projectmanagementbackend.repository.UserRepository;
import com.projectmanager.projectmanagementbackend.security.JwtUtil;
import com.projectmanager.projectmanagementbackend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(RegisterRequest request) {

        // Check for duplicate email
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Use role from request if provided, otherwise default to TEAM_MEMBER
        if (request.getRole() != null) {
            user.setRole(Role.valueOf(request.getRole())); // e.g., "ADMIN" or "TEAM_MEMBER"
        } else {
            user.setRole(Role.TEAM_MEMBER);
        }

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtUtil.generateToken(request.getEmail());

        return new LoginResponse(token);
    }
}
