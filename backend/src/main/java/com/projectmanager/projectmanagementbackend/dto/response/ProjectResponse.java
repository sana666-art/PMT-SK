package com.projectmanager.projectmanagementbackend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private String status;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private UserResponse owner;

    private List<ProjectMemberResponse> members;

}