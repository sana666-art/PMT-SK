package com.projectmanager.projectmanagementbackend.dto.response;

import lombok.Data;

@Data
public class ProjectMemberResponse {

    private Long id;
    private String role;
    private UserResponse user;

}