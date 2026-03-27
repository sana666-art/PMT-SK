package com.projectmanager.projectmanagementbackend.dto.request;

import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.sql.Update;

import java.time.LocalDateTime;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    @NotBlank(message = "Priority is required")
    private String priority;      // e.g., LOW, MEDIUM, HIGH

    private TaskStatus status;    // optional for creation, default TODO

    private LocalDateTime dueDate;
    @NotNull(message = "Project ID is required")
    private Long projectId;       // project to which task belongs

    @NotNull(groups = Update.class)
    private Long assigneeId;      // optional, can assign later
}
