package com.shareSphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exchanges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long exchangeId;

    @Enumerated(EnumType.STRING)
    private Type type;

    @OneToOne
    @JoinColumn(name = "skill_request_id")
    private SkillRequest skillRequest;

    @OneToOne
    @JoinColumn(name = "tool_request_id")
    private ToolRequest toolRequest;

    @ManyToOne
    @JoinColumn(name = "giver_id", nullable = false)
    private User giver;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @OneToOne(mappedBy = "exchange", cascade = CascadeType.ALL)
    private Payment payment;

    public enum Type {
        SKILL, TOOL
    }
}
