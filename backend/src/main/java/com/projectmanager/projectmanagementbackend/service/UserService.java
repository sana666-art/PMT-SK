package com.projectmanager.projectmanagementbackend.service;

import com.projectmanager.projectmanagementbackend.dto.request.ChangePasswordRequest;
import com.projectmanager.projectmanagementbackend.dto.request.RegisterRequest;
import com.projectmanager.projectmanagementbackend.dto.request.UpdateUserRequest;
import com.projectmanager.projectmanagementbackend.dto.response.UserResponse;
import com.projectmanager.projectmanagementbackend.entity.User;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    User getUserByEmail(String email);

    List<User> getAllUsers();

    UserResponse updateMyProfile(String email, UpdateUserRequest request);

    void changePassword(String email, ChangePasswordRequest request);

    void deactivateMyAccount(String email);

//    UserResponse getUserById(Long id);

//    UserResponse updateUser(Long id, @Valid RegisterRequest request);

    void deleteUser(Long id);

    User createUserFromRequest(@Valid RegisterRequest request);

    String uploadAvatar(String email, MultipartFile file);
}
