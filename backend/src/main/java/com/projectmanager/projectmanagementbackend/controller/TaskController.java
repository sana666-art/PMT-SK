package com.projectmanager.projectmanagementbackend.controller;

import com.projectmanager.projectmanagementbackend.dto.request.TaskRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ApiResponse;
import com.projectmanager.projectmanagementbackend.dto.response.TaskResponse;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;
import com.projectmanager.projectmanagementbackend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request
    ) {

        TaskResponse task = taskService.createTask(request);

        ApiResponse<TaskResponse> response =
                new ApiResponse<>(true, "Task created successfully", task);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {

        List<TaskResponse> tasks = taskService.getAllTasks();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Tasks fetched successfully", tasks)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {

        TaskResponse task = taskService.getTaskById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task fetched successfully", task)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request
    ) {

        TaskResponse updated = taskService.updateTask(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task updated successfully", updated)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {

        taskService.deleteTask(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task deleted successfully", null)
        );
    }

    @GetMapping("/assignee/{userId}")
    public ResponseEntity<List<TaskResponse>> getTasksByAssignee(
            @PathVariable Long userId
    ) {
        List<TaskResponse> tasks = taskService.getTasksByAssignee(userId);
        return ResponseEntity.ok(tasks);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status
    ) {

        TaskResponse updated = taskService.updateTaskStatus(id, status);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Task status updated", updated)
        );
    }

}