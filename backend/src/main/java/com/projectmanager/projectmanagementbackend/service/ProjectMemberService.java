package com.projectmanager.projectmanagementbackend.service;

import com.projectmanager.projectmanagementbackend.dto.request.AddProjectMemberRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ProjectMemberResponse;

import java.util.List;

public interface ProjectMemberService {

    ProjectMemberResponse addMemberToProject(Long projectId, AddProjectMemberRequest request);

    List<ProjectMemberResponse> getProjectMembers(Long projectId);

    void removeMemberFromProject(Long projectId, Long userId);
}
