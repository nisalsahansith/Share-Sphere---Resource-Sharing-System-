package com.shareSphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.UUID;

@Entity
@Table(name = "pricing")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pricing {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID pricingId;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Skill skill;

    @ManyToOne
    @JoinColumn(name = "tool_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Tool tool;

    @Enumerated(EnumType.STRING)
    private PriceType priceType;

    private Double price;

    public enum PriceType {
        PER_HOUR, PER_DAY, FIXED
    }
}
