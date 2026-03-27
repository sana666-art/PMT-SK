package com.projectmanager.projectmanagementbackend.dto.request;

import lombok.Data;

@Data
public class AddProjectMemberRequest {

    private Long userId;

    private String role;

}