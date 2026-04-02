package com.projectmanager.projectmanagementbackend.service;

import com.projectmanager.projectmanagementbackend.dto.request.TaskRequest;
import com.projectmanager.projectmanagementbackend.dto.response.TaskResponse;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;

import java.util.List;

public interface TaskService {

    TaskResponse getTaskById(Long id, CustomUserDetails user);

    TaskResponse updateTask(Long id, TaskRequest request, CustomUserDetails user);

    void deleteTask(Long id, CustomUserDetails user);

    List<TaskResponse> getTasksByAssignee(Long userId, CustomUserDetails user);

    TaskResponse updateTaskStatus(Long taskId, TaskStatus status, CustomUserDetails user);

    TaskResponse createTask(TaskRequest request, CustomUserDetails user);

    List<TaskResponse> getTasks(CustomUserDetails user);

    TaskResponse assignTask(Long id, Long assigneeId, CustomUserDetails user);
}