package com.projectmanager.projectmanagementbackend.service;

import com.projectmanager.projectmanagementbackend.dto.request.LoginRequest;
import com.projectmanager.projectmanagementbackend.dto.request.RegisterRequest;
import com.projectmanager.projectmanagementbackend.dto.response.LoginResponse;

public interface AuthService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}