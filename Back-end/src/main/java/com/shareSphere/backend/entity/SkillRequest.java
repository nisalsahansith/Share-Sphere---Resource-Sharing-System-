package com.shareSphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "skill_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillRequestId;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    @Column(name = "total_price")
    private double totalPrice;

    @Column(name = "requested_date")
    private LocalDateTime requestedDate;

    @Column(columnDefinition = "TEXT")
    private String message;

    @OneToOne(mappedBy = "skillRequest", cascade = CascadeType.ALL)
    private Exchange exchange;

    public enum Status {
        PENDING, ACCEPTED, REJECTED, MAYBE_LATER
    }
}
