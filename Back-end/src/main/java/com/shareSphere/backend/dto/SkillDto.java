package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Pricing;
import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SkillDto {
    private Long skillId;
    private String userId;
    private String name;
    private String description;
    private Skill.Availability availability;
    private LocalDateTime createdAt;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> imageUrls;

    private UUID pricingId;
    private Double price;
    private Pricing.PriceType priceType;

}
