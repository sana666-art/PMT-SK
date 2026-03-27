package com.projectmanager.projectmanagementbackend.service;

import com.projectmanager.projectmanagementbackend.dto.request.CreateProjectRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ProjectResponse;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(CreateProjectRequest request, String ownerEmail);

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(Long id);

    ProjectResponse updateProject(Long id, CreateProjectRequest request);

    void deleteProject(Long id);
}