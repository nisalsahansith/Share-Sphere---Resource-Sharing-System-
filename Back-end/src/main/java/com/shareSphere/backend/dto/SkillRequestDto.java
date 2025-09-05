package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.SkillRequest;
import com.shareSphere.backend.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SkillRequestDto {
    private Long skillRequestId;

    private String requesterId;

    private String skillId;

    private SkillRequest.Status status;

    private LocalDateTime requestedDates;

    private String message;

    private double price;

    private String exchangeId;

    private SkillDto skillDto;

}
