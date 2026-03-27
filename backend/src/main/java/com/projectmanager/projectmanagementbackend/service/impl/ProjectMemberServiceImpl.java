package com.projectmanager.projectmanagementbackend.service.impl;

import com.projectmanager.projectmanagementbackend.entity.Project;
import com.projectmanager.projectmanagementbackend.entity.ProjectMember;
import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.repository.ProjectMemberRepository;
import com.projectmanager.projectmanagementbackend.repository.ProjectRepository;
import com.projectmanager.projectmanagementbackend.repository.UserRepository;
import com.projectmanager.projectmanagementbackend.service.ProjectMemberService;
import com.projectmanager.projectmanagementbackend.dto.request.AddProjectMemberRequest;
import com.projectmanager.projectmanagementbackend.dto.response.ProjectMemberResponse;
import com.projectmanager.projectmanagementbackend.mapper.ProjectMemberMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ProjectMemberServiceImpl(ProjectRepository projectRepository,
                                    UserRepository userRepository,
                                    ProjectMemberRepository projectMemberRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    @Override
    public ProjectMemberResponse addMemberToProject(Long projectId, AddProjectMemberRequest request) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (projectMemberRepository
                .findByProjectIdAndUserId(projectId, user.getId())
                .isPresent()) {
            throw new RuntimeException("User already a member of this project");
        }

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(user);
        member.setRole(request.getRole());

        ProjectMember savedMember = projectMemberRepository.save(member);

        return ProjectMemberMapper.toResponse(savedMember);
    }

    @Override
    public List<ProjectMemberResponse> getProjectMembers(Long projectId) {

        return projectMemberRepository
                .findByProjectId(projectId)
                .stream()
                .map(ProjectMemberMapper::toResponse)
                .toList();
    }

    @Override
    public void removeMemberFromProject(Long projectId, Long userId) {
        ProjectMember member = projectMemberRepository
                .findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Member not found in project"));

        projectMemberRepository.delete(member);
    }
}