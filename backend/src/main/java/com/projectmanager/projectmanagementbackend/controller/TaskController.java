package com.projectmanager.projectmanagementbackend.controller;

import com.projectmanager.projectmanagementbackend.dto.request.TaskRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ApiResponse;
import com.projectmanager.projectmanagementbackend.dto.response.TaskResponse;
import com.projectmanager.projectmanagementbackend.entity.enums.Permission;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;
import com.projectmanager.projectmanagementbackend.service.TaskService;
import com.projectmanager.projectmanagementbackend.service.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // ================= CREATE TASK =================
    @PreAuthorize("hasAuthority('CREATE_TASK')")
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        TaskResponse task = taskService.createTask(request, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task created successfully", task));
    }

    // ================= GET ALL TASKS =================
    @PreAuthorize("hasAuthority('VIEW_TASK')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        List<TaskResponse> tasks = taskService.getTasks(user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tasks fetched successfully", tasks));
    }

    // ================= GET TASK BY ID =================
    @PreAuthorize("hasAuthority('VIEW_TASK')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        TaskResponse task = taskService.getTaskById(id, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task fetched successfully", task));
    }

    // ================= UPDATE TASK =================
    @PreAuthorize("hasAuthority('UPDATE_TASK')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        TaskResponse updated = taskService.updateTask(id, request, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task updated successfully", updated));
    }

    // ================= DELETE TASK =================
    @PreAuthorize("hasAuthority('DELETE_TASK')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        taskService.deleteTask(id, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted successfully", null));
    }

    // ================= ASSIGN TASK =================
    @PreAuthorize("hasAuthority('ASSIGN_TASK')")
    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable Long id,
            @RequestParam Long assigneeId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        TaskResponse assigned = taskService.assignTask(id, assigneeId, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task assigned successfully", assigned));
    }

    // ================= GET TASKS BY ASSIGNEE =================
    @PreAuthorize("hasAuthority('VIEW_TASK')")
    @GetMapping("/assignee/{userId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByAssignee(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        List<TaskResponse> tasks = taskService.getTasksByAssignee(userId, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tasks fetched successfully", tasks));
    }

    // ================= UPDATE TASK STATUS =================
    @PreAuthorize("hasAuthority('UPDATE_TASK')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        TaskResponse updated = taskService.updateTaskStatus(id, status, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task status updated successfully", updated));
    }

}