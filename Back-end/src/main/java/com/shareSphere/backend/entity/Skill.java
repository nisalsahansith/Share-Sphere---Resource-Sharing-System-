package com.shareSphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    private LocalDateTime createdAt;

    private LocalDate startDate;
    private LocalDate endDate;

    @ElementCollection
    @CollectionTable(name = "skill_images", joinColumns = @JoinColumn(name = "skill_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    public enum Availability {
        AVAILABLE, UNAVAILABLE
    }
}
