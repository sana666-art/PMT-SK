package com.projectmanager.projectmanagementbackend.service.impl;

import com.projectmanager.projectmanagementbackend.entity.Project;
import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.repository.ProjectRepository;
import com.projectmanager.projectmanagementbackend.repository.UserRepository;
import com.projectmanager.projectmanagementbackend.service.ProjectService;
import com.projectmanager.projectmanagementbackend.dto.request.CreateProjectRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ProjectResponse;
import com.projectmanager.projectmanagementbackend.mapper.ProjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ProjectResponse createProject(CreateProjectRequest request, String ownerEmail) {

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setOwner(owner);
        project.setStatus("TODO");

        Project savedProject = projectRepository.save(project);

        return ProjectMapper.toResponse(savedProject);
    }

    @Override
    public List<ProjectResponse> getAllProjects() {

        return projectRepository
                .findAll()
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    @Override
    public ProjectResponse getProjectById(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return ProjectMapper.toResponse(project);
    }

    @Override
    public ProjectResponse updateProject(Long id, CreateProjectRequest request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());

        Project updatedProject = projectRepository.save(project);

        return ProjectMapper.toResponse(updatedProject);
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}