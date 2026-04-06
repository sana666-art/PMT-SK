package com.projectmanager.projectmanagementbackend.service;

import com.projectmanager.projectmanagementbackend.dto.request.TaskRequest;
import com.projectmanager.projectmanagementbackend.dto.response.TaskResponse;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskRequest request);

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(Long id);

    TaskResponse updateTask(Long id, TaskRequest request);

    void deleteTask(Long id);

    List<TaskResponse> getTasksByProject(Long projectId);

    List<TaskResponse> getTasksByAssignee(Long userId);

    TaskResponse updateTaskStatus(Long taskId, TaskStatus status);

}