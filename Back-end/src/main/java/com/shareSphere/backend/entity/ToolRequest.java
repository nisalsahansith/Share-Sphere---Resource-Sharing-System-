package com.shareSphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tool_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ToolRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long toolRequestId;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne
    @JoinColumn(name = "tool_id", nullable = false)
    private Tool tool;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    private LocalDateTime borrowStartDate;
    private LocalDateTime borrowEndDate;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "total_price")
    private double totalPrice;


    @OneToOne(mappedBy = "toolRequest", cascade = CascadeType.ALL)
    private Exchange exchange;

    public enum Status {
        PENDING, ACCEPTED, REJECTED, MAYBE_LATER
    }
}
