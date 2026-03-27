package com.projectmanager.projectmanagementbackend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.projectmanager.projectmanagementbackend.dto.request.ChangePasswordRequest;
import com.projectmanager.projectmanagementbackend.dto.request.RegisterRequest;
import com.projectmanager.projectmanagementbackend.dto.request.UpdateUserRequest;
import com.projectmanager.projectmanagementbackend.dto.response.UserResponse;
import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.entity.enums.Role;
import com.projectmanager.projectmanagementbackend.exception.ResourceNotFoundException;
import com.projectmanager.projectmanagementbackend.repository.UserRepository;
import com.projectmanager.projectmanagementbackend.service.UserService;
import io.jsonwebtoken.io.IOException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import static com.projectmanager.projectmanagementbackend.mapper.UserMapper.toResponse;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cloudinary = cloudinary;
    }

    @Override
    public User createUserFromRequest(RegisterRequest request) {

        // 1️- Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // 2️- Create user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // IMPORTANT: encode password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 3️- Set role (default)
        if (request.getRole() != null) {
            user.setRole(Role.valueOf(request.getRole()));
        } else {
            user.setRole(Role.TEAM_MEMBER);
        }

        // 4️- Set createdAt
        user.setCreatedAt(LocalDateTime.now());

        // 5️- Save
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

//    @Override
//    public UserResponse getUserById(Long id) {
//
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
//
//        return toResponse(user);
//    }

//    @Override
//    public UserResponse updateUser(Long id, RegisterRequest request) {
//        // 1️- Fetch user or throw exception
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
//
//        // 2️- Update fields (only if not null)
//        if (request.getName() != null) {
//            user.setName(request.getName());
//        }
//
//        if (request.getEmail() != null) {
//            user.setEmail(request.getEmail());
//        }
//
//        if (request.getRole() != null) {
//            user.setRole(Role.valueOf(request.getRole()));
//        }
//
//        // 3️- Save updated user
//        User updatedUser = userRepository.save(user);
//
//        // 4️- Return DTO response
//        return toResponse(updatedUser);
//    }

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        userRepository.deleteById(id);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public UserResponse updateMyProfile(String email, UpdateUserRequest request) {

        // 1️- Get logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2️- Update name (if provided)
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        // 3️- Update email (if provided)
        if (request.getEmail() != null && !request.getEmail().isBlank()) {

            // Prevent duplicate email
            if (!user.getEmail().equals(request.getEmail()) &&
                    userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already in use");
            }

            user.setEmail(request.getEmail());
        }

        // 4️- Save updated user
        User updatedUser = userRepository.save(user);

        // 5️- Return DTO
        return toResponse(updatedUser);
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest request) {

        // 1️- Get logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2️- Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // 3️- Prevent same password reuse
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password cannot be same as old password");
        }

        // 4️- Encode and set new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // 5️- Save user
        userRepository.save(user);
    }

    @Override
    public void deactivateMyAccount(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setActive(false);

        userRepository.save(user);
    }

    @Override
    public String uploadAvatar(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            // Cloudinary integration
            AtomicReference<Map> uploadResult = new AtomicReference<>(cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "avatars", "public_id", "user_" + user.getId())
            ));

            String url = (String) uploadResult.get().get("secure_url");
            user.setAvatarUrl(url);
            userRepository.save(user);
            return url;

        } catch (IOException | java.io.IOException e) {
            throw new RuntimeException("Failed to upload avatar", e);
        }
    }

}
