package com.projectmanager.projectmanagementbackend.mapper;

import com.projectmanager.projectmanagementbackend.dto.response.ProjectMemberResponse;
import com.projectmanager.projectmanagementbackend.entity.ProjectMember;

public class ProjectMemberMapper {

    public static ProjectMemberResponse toResponse(ProjectMember member) {

        if (member == null) return null;

        ProjectMemberResponse response = new ProjectMemberResponse();

        response.setId(member.getId());
        response.setRole(member.getRole());

        response.setUser(UserMapper.toResponse(member.getUser()));

        return response;
    }
}