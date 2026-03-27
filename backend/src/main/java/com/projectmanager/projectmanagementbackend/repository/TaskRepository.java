package com.projectmanager.projectmanagementbackend.repository;

import com.projectmanager.projectmanagementbackend.entity.Task;
import com.projectmanager.projectmanagementbackend.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssigneeId(Long userId);

    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);
}