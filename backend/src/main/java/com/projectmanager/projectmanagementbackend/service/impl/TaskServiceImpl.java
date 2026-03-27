package com.projectmanager.projectmanagementbackend.service.impl;

import com.projectmanager.projectmanagementbackend.dto.request.TaskRequest;
import com.projectmanager.projectmanagementbackend.dto.response.TaskResponse;
import com.projectmanager.projectmanagementbackend.entity.Project;
import com.projectmanager.projectmanagementbackend.entity.Task;
import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskPriority;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;
import com.projectmanager.projectmanagementbackend.exception.ResourceNotFoundException;
import com.projectmanager.projectmanagementbackend.mapper.TaskMapper;
import com.projectmanager.projectmanagementbackend.repository.ProjectRepository;
import com.projectmanager.projectmanagementbackend.repository.TaskRepository;
import com.projectmanager.projectmanagementbackend.repository.UserRepository;
import com.projectmanager.projectmanagementbackend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /*
        CREATE TASK
     */
    @Override
    public TaskResponse createTask(TaskRequest request) {

        // 1️⃣ Fetch project
        var project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // 2️⃣ Fetch assignee (optional)
        var assignee = request.getAssigneeId() != null ?
                userRepository.findById(request.getAssigneeId())
                        .orElseThrow(() -> new RuntimeException("Assignee not found"))
                : null;

        // 3️⃣ Map request to entity
        var task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(TaskPriority.valueOf(request.getPriority()));
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setAssignee(assignee);

        // 4️⃣ Save and return response DTO
        var saved = taskRepository.save(task);
        return TaskMapper.toResponse(saved);
    }

    /*
        GET ALL TASKS
     */
    @Override
    public List<TaskResponse> getAllTasks() {

        return taskRepository
                .findAll()
                .stream()
                .map(TaskMapper::toResponse)
                .toList();
    }

    /*
        GET TASK BY ID
     */
    @Override
    public TaskResponse getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        return TaskMapper.toResponse(task);
    }

    /*
        UPDATE TASK
     */
    @Override
    public TaskResponse updateTask(Long taskId, TaskRequest request) {

        // 1️⃣ Fetch task
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // 2️⃣ Update fields
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(TaskPriority.valueOf(request.getPriority()));
        task.setDueDate(request.getDueDate());

        // Update status only if provided
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        // 3️⃣ Update assignee if provided
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        // 4️⃣ Save and return DTO
        Task updated = taskRepository.save(task);
        return TaskMapper.toResponse(updated);
    }

    /*
        DELETE TASK
     */
    @Override
    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        taskRepository.delete(task);
    }

    /*
        GET TASKS BY PROJECT
     */
    @Override
    public List<TaskResponse> getTasksByProject(Long projectId) {

        // Check if project exists
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Fetch tasks
        List<Task> tasks = taskRepository.findByProjectId(projectId);

        // Map to DTOs
        return tasks.stream()
                .map(TaskMapper::toResponse)
                .toList();
    }

    /*
        GET TASKS BY ASSIGNEE
     */
    @Override
    public List<TaskResponse> getTasksByAssignee(Long userId) {

        // Check if user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Fetch tasks
        List<Task> tasks = taskRepository.findByAssigneeId(userId);

        // Map to DTOs
        return tasks.stream()
                .map(TaskMapper::toResponse)
                .toList();
    }

    /*
        UPDATE TASK STATUS (KANBAN)
     */
    @Override
    public TaskResponse updateTaskStatus(Long taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setStatus(status);
        Task updated = taskRepository.save(task);

        return TaskMapper.toResponse(updated);
    }

}
