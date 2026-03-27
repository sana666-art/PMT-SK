package com.projectmanager.projectmanagementbackend.dto.response;

import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String priority;
    private LocalDateTime dueDate;
    private TaskProjectResponse project; // simplified project info
    private UserResponse assignee;       // keep assignee as is, optional to simplify later
}