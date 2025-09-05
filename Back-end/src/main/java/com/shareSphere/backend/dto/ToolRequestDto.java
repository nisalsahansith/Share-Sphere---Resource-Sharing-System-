package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.entity.Tool;
import com.shareSphere.backend.entity.ToolRequest;
import com.shareSphere.backend.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ToolRequestDto {
    private Long toolRequestId;
    private String requesterId;

    private String toolId;

    private ToolRequest.Status status;

    private LocalDateTime borrowStartDate;
    private LocalDateTime borrowEndDate;

    private String message;

    private double price;

    private ToolDto toolDto;


    private Exchange exchange;

}
