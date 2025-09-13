package com.shareSphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tools")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long toolId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String description;

    @Column(name = "tool_condition")
    private String condition;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", length = 20)
    private AvailabilityStatus availabilityStatus;

    private LocalDateTime createdAt;

    private String country;

    private String state;

    private LocalDate startDate;
    private LocalDate endDate;

    @ElementCollection
    @CollectionTable(name = "tool_images", joinColumns = @JoinColumn(name = "tool_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    public enum AvailabilityStatus {
        AVAILABLE, UNAVAILABLE,RESTRICT,ACTIVE
    }
}
