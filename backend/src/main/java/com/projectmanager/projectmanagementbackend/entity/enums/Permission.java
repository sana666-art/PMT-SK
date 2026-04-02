package com.projectmanager.projectmanagementbackend.entity.enums;

public enum Permission {

    // PROJECT
    CREATE_PROJECT,
    EDIT_PROJECT,
    DELETE_PROJECT,
    VIEW_PROJECT,        // scoped (own / assigned)
    VIEW_ALL_PROJECTS,   // global

    // TASK
    CREATE_TASK,
    ASSIGN_TASK,
    UPDATE_TASK,
    DELETE_TASK,
    VIEW_TASK,           // scoped
    VIEW_ALL_TASKS,      // global

    // USER
    VIEW_USERS,
    UPDATE_USER,
    DELETE_USER,

    VIEW_DASHBOARD
}