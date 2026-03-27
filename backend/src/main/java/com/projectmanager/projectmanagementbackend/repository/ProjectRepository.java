package com.projectmanager.projectmanagementbackend.repository;

import com.projectmanager.projectmanagementbackend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}