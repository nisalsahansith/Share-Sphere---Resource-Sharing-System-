package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.*;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ExchangeDto {
    private Long exchangeId;
    private Exchange.Type type;
    private String skillRequestId;
    private String toolRequestId;
    private String giverId;
    private String receiverId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String paymentId;
    private String status;

    private SkillRequestDto skillRequestDto;
    private ToolRequestDto toolRequestDto;

}
