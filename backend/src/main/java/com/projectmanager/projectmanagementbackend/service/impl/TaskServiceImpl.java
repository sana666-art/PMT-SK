package com.projectmanager.projectmanagementbackend.service.impl;

import com.projectmanager.projectmanagementbackend.dto.request.TaskRequest;
import com.projectmanager.projectmanagementbackend.dto.response.TaskResponse;
import com.projectmanager.projectmanagementbackend.entity.Project;
import com.projectmanager.projectmanagementbackend.entity.Task;
import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.entity.enums.Permission;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskPriority;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;
import com.projectmanager.projectmanagementbackend.exception.AccessDeniedException;
import com.projectmanager.projectmanagementbackend.exception.ResourceNotFoundException;
import com.projectmanager.projectmanagementbackend.mapper.TaskMapper;
import com.projectmanager.projectmanagementbackend.repository.ProjectRepository;
import com.projectmanager.projectmanagementbackend.repository.TaskRepository;
import com.projectmanager.projectmanagementbackend.repository.UserRepository;
import com.projectmanager.projectmanagementbackend.service.TaskService;
import com.projectmanager.projectmanagementbackend.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    // ================= CREATE TASK =================
    @Override
    public TaskResponse createTask(TaskRequest request, CustomUserDetails userDetails) {

        User user = userDetails.user();

        if (!user.getRole().getPermissions().contains(Permission.CREATE_TASK)) {
            throw new AccessDeniedException("You don't have permission to create tasks");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(TaskPriority.valueOf(request.getPriority()));
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setAssignee(assignee);

        return TaskMapper.toResponse(taskRepository.save(task));
    }

    // ================= GET ALL TASKS =================
    @Override
    public List<TaskResponse> getTasks(CustomUserDetails userDetails) {

        User user = userDetails.user();

        if (user.getRole().getPermissions().contains(Permission.VIEW_ALL_TASKS)) {
            return taskRepository.findAll().stream()
                    .map(TaskMapper::toResponse).toList();
        }

        // Only tasks where user is assignee or project member
        return taskRepository.findAll().stream()
                .filter(task -> isTaskAccessible(task, user))
                .map(TaskMapper::toResponse).toList();
    }

    // ================= GET TASK BY ID =================
    @Override
    public TaskResponse getTaskById(Long id, CustomUserDetails userDetails) {

        User user = userDetails.user();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!user.getRole().getPermissions().contains(Permission.VIEW_ALL_TASKS) &&
                !isTaskAccessible(task, user)) {
            throw new AccessDeniedException("You are not allowed to view this task");
        }

        return TaskMapper.toResponse(task);
    }

    // ================= UPDATE TASK =================
    @Override
    public TaskResponse updateTask(Long taskId, TaskRequest request, CustomUserDetails userDetails) {

        User user = userDetails.user();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!user.getRole().getPermissions().contains(Permission.UPDATE_TASK) ||
                !isTaskAccessible(task, user)) {
            throw new AccessDeniedException("You are not allowed to update this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(TaskPriority.valueOf(request.getPriority()));
        task.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        return TaskMapper.toResponse(taskRepository.save(task));
    }

    // ================= DELETE TASK =================
    @Override
    public void deleteTask(Long taskId, CustomUserDetails userDetails) {

        User user = userDetails.user();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!user.getRole().getPermissions().contains(Permission.DELETE_TASK) ||
                !isTaskAccessible(task, user)) {
            throw new AccessDeniedException("You are not allowed to delete this task");
        }

        taskRepository.delete(task);
    }

    // ================= ASSIGN TASK =================
    @Override
    public TaskResponse assignTask(Long taskId, Long assigneeId, CustomUserDetails userDetails) {

        User user = userDetails.user();

        if (!user.getRole().getPermissions().contains(Permission.ASSIGN_TASK)) {
            throw new AccessDeniedException("You are not allowed to assign tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));

        task.setAssignee(assignee);

        return TaskMapper.toResponse(taskRepository.save(task));
    }

    // ================= GET TASKS BY ASSIGNEE =================
    @Override
    public List<TaskResponse> getTasksByAssignee(Long userId, CustomUserDetails userDetails) {

        User user = userDetails.user();

        if (!user.getRole().getPermissions().contains(Permission.VIEW_TASK)) {
            throw new AccessDeniedException("You are not allowed to view tasks");
        }

        List<Task> tasks = taskRepository.findByAssigneeId(userId);

        // Apply ownership filter if user is not admin
        if (!user.getRole().getPermissions().contains(Permission.VIEW_ALL_TASKS)) {
            tasks = tasks.stream()
                    .filter(task -> isTaskAccessible(task, user))
                    .toList();
        }

        return tasks.stream().map(TaskMapper::toResponse).toList();
    }

    // ================= UPDATE TASK STATUS =================
    @Override
    public TaskResponse updateTaskStatus(Long taskId, TaskStatus status, CustomUserDetails userDetails) {

        User user = userDetails.user();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!user.getRole().getPermissions().contains(Permission.UPDATE_TASK) ||
                !isTaskAccessible(task, user)) {
            throw new AccessDeniedException("You are not allowed to update this task");
        }

        task.setStatus(status);
        return TaskMapper.toResponse(taskRepository.save(task));
    }

    // ================= HELPER =================
    private boolean isTaskAccessible(Task task, User user) {
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(user.getId());
        boolean isProjectMember = task.getProject().getMembers()
                .stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
        return isAssignee || isProjectMember;
    }
}