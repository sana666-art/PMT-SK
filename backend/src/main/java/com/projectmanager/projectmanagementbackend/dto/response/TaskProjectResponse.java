package com.projectmanager.projectmanagementbackend.dto.response;

import lombok.Data;

@Data
public class TaskProjectResponse {
    private Long id;
    private String name;
    private String status;
}