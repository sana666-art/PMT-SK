package com.projectmanager.projectmanagementbackend.controller;

import com.projectmanager.projectmanagementbackend.service.ProjectMemberService;
import org.springframework.web.bind.annotation.*;
import com.projectmanager.projectmanagementbackend.dto.request.AddProjectMemberRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ProjectMemberResponse;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    public ProjectMemberController(ProjectMemberService projectMemberService){
        this.projectMemberService = projectMemberService;
    }

    @PostMapping
    public ProjectMemberResponse addMember(
            @PathVariable Long projectId,
            @RequestBody AddProjectMemberRequest request
    ) {
        return projectMemberService.addMemberToProject(projectId, request);
    }

    @GetMapping
    public List<ProjectMemberResponse> getMembers(@PathVariable Long projectId) {
        return projectMemberService.getProjectMembers(projectId);
    }

    @DeleteMapping("/{userId}")
    public String removeMember(@PathVariable Long projectId,
                               @PathVariable Long userId){
        projectMemberService.removeMemberFromProject(projectId, userId);
        return "Member removed successfully";
    }
}
