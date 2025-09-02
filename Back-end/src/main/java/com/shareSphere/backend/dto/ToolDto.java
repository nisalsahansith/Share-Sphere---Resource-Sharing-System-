package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Pricing;
import com.shareSphere.backend.entity.Tool;
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
public class ToolDto {
    private Long toolId;
    private String userId;
    private String name;
    private String description;
    private String condition;
    private Tool.AvailabilityStatus availabilityStatus;
    private LocalDateTime createdAt;
    private String country;
    private String state;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> imageUrls;

    private UUID pricingId;
    private Double price;
    private Pricing.PriceType priceType;

}
