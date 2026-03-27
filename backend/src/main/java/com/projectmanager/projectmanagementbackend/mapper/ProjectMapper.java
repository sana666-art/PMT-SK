package com.projectmanager.projectmanagementbackend.mapper;

import com.projectmanager.projectmanagementbackend.dto.response.ProjectMemberResponse;
import com.projectmanager.projectmanagementbackend.dto.response.ProjectResponse;
import com.projectmanager.projectmanagementbackend.entity.Project;

import java.util.List;
import java.util.stream.Collectors;

public class ProjectMapper {

    public static ProjectResponse toResponse(Project project) {

        if (project == null) return null;

        ProjectResponse response = new ProjectResponse();

        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setStatus(project.getStatus());
        response.setStartDate(project.getStartDate());
        response.setEndDate(project.getEndDate());

        response.setOwner(UserMapper.toResponse(project.getOwner()));

        if (project.getMembers() != null) {
            List<ProjectMemberResponse> members =
                    project.getMembers()
                            .stream()
                            .map(ProjectMemberMapper::toResponse)
                            .collect(Collectors.toList());

            response.setMembers(members);
        }

        return response;
    }
}