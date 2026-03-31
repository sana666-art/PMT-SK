package com.projectmanager.projectmanagementbackend.mapper;

import com.projectmanager.projectmanagementbackend.dto.response.UserResponse;
import com.projectmanager.projectmanagementbackend.entity.User;

public class UserMapper {

    public static UserResponse toResponse(User user) {

        if (user == null) return null;

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(String.valueOf(user.getRole()))
                .createdAt(user.getCreatedAt())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}