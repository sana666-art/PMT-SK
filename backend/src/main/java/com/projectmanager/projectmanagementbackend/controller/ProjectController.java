package com.projectmanager.projectmanagementbackend.controller;

import com.projectmanager.projectmanagementbackend.service.ProjectService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.projectmanager.projectmanagementbackend.dto.request.CreateProjectRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ProjectResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @PostMapping
    public ProjectResponse createProject(
            @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return projectService.createProject(request, userDetails.getUsername());
    }

    @GetMapping
    public List<ProjectResponse> getAllProjects(){
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public ProjectResponse getProjectById(@PathVariable Long id){
        return projectService.getProjectById(id);
    }

    @PutMapping("/{id}")
    public ProjectResponse updateProject(
            @PathVariable Long id,
            @RequestBody CreateProjectRequest request){

        return projectService.updateProject(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id){
        projectService.deleteProject(id);
        return "Project deleted successfully";
    }
}