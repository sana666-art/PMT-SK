package com.projectmanager.projectmanagementbackend.entity.enums;

import lombok.Getter;

import java.util.Set;

@Getter
public enum Role {

    ADMIN(Set.of(
            // Project
            Permission.CREATE_PROJECT,
            Permission.EDIT_PROJECT,
            Permission.DELETE_PROJECT,
            Permission.VIEW_PROJECT,
            Permission.VIEW_ALL_PROJECTS,

            // Task
            Permission.CREATE_TASK,
            Permission.ASSIGN_TASK,
            Permission.UPDATE_TASK,
            Permission.DELETE_TASK,
            Permission.VIEW_TASK,
            Permission.VIEW_ALL_TASKS,

            // User
            Permission.VIEW_USERS,
            Permission.UPDATE_USER,
            Permission.DELETE_USER,

            // Dashboard
            Permission.VIEW_DASHBOARD
    )),

    PROJECT_MANAGER(Set.of(
            // Project
            Permission.CREATE_PROJECT,
            Permission.EDIT_PROJECT,
            Permission.VIEW_PROJECT,

            // Task
            Permission.CREATE_TASK,
            Permission.ASSIGN_TASK,
            Permission.UPDATE_TASK,
            Permission.VIEW_TASK,

            // Dashboard
            Permission.VIEW_DASHBOARD
    )),

    TEAM_MEMBER(Set.of(
            // Project
            Permission.VIEW_PROJECT,

            // Task
            Permission.UPDATE_TASK,
            Permission.VIEW_TASK
    ));

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }
}