package com.projectmanager.projectmanagementbackend.controller;

import com.projectmanager.projectmanagementbackend.dto.request.ChangePasswordRequest;
import com.projectmanager.projectmanagementbackend.dto.request.RegisterRequest;
import com.projectmanager.projectmanagementbackend.dto.request.UpdateUserRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ApiResponse;
import com.projectmanager.projectmanagementbackend.dto.response.UserResponse;
import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.mapper.UserMapper;
import com.projectmanager.projectmanagementbackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.projectmanager.projectmanagementbackend.mapper.UserMapper.toResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody RegisterRequest request
    ) {
        User user = userService.createUserFromRequest(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "User created successfully", toResponse(user))
        );
    }

    @PreAuthorize("hasAuthority('VIEW_USERS')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> users = userService.getAllUsers()
                .stream()
                .map(UserMapper::toResponse)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Users fetched successfully", users)
        );
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email);

        UserResponse response = toResponse(user);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Current user fetched successfully", response)
        );
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request
    ) {

        String email = authentication.getName();

        UserResponse updatedUser = userService.updateMyProfile(email, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile updated successfully", updatedUser)
        );
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        String email = authentication.getName();

        userService.changePassword(email, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Password changed successfully", null)
        );
    }

    @PreAuthorize("hasAuthority('DELETE_USER')")
    @PutMapping("/deactivate")
    public ResponseEntity<ApiResponse<String>> deactivateAccount(Authentication authentication) {

        String email = authentication.getName();

        userService.deactivateMyAccount(email);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Account deactivated successfully", null)
        );
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PutMapping("/me/avatar")
    public ResponseEntity<ApiResponse<String>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String email = authentication.getName();

        String avatarUrl = userService.uploadAvatar(email, file);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Avatar uploaded successfully", avatarUrl)
        );
    }

    @PreAuthorize("hasAuthority('DELETE_USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "User deleted successfully", null)
        );
    }

//    @PreAuthorize("hasAuthority('VIEW_USERS')")
//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
//
//        UserResponse user = userService.getUserById(id);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(true, "User fetched successfully", user)
//        );
//    }
//    @PreAuthorize("hasAuthority('UPDATE_USER')")
//    @PutMapping("/{id}")
//    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
//            @PathVariable Long id,
//            @Valid @RequestBody RegisterRequest request
//    ) {
//
//        UserResponse updated = userService.updateUser(id, request);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(true, "User updated successfully", updated)
//        );
//    }
}