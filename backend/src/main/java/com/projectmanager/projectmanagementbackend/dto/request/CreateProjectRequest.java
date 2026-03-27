package com.projectmanager.projectmanagementbackend.dto.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateProjectRequest {

    private String name;

    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

}