package com.projectmanager.projectmanagementbackend.mapper;

import com.projectmanager.projectmanagementbackend.dto.response.TaskProjectResponse;
import com.projectmanager.projectmanagementbackend.dto.response.TaskResponse;
import com.projectmanager.projectmanagementbackend.dto.response.UserResponse;
import com.projectmanager.projectmanagementbackend.entity.Task;

public class TaskMapper {

    public static TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(String.valueOf(task.getPriority()));
        response.setDueDate(task.getDueDate());

        // Simplified project
        TaskProjectResponse projectResponse = new TaskProjectResponse();
        projectResponse.setId(task.getProject().getId());
        projectResponse.setName(task.getProject().getName());
        projectResponse.setStatus(task.getProject().getStatus());
        response.setProject(projectResponse);

        // Assignee (can also simplify if needed)
        if (task.getAssignee() != null) {
            UserResponse userResponse = new UserResponse();
            userResponse.setId(task.getAssignee().getId());
            userResponse.setName(task.getAssignee().getName());
            userResponse.setEmail(task.getAssignee().getEmail());
            response.setAssignee(userResponse);
        }

        return response;
    }
}