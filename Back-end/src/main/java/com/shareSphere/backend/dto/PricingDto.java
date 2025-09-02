package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Pricing;

import lombok.Data;

import java.util.UUID;

@Data
public class PricingDto {
    private UUID pricingId;

    private String ownerId;

    private String skillId;

    private String toolId;

    private String priceType;

    private Double price;
}
