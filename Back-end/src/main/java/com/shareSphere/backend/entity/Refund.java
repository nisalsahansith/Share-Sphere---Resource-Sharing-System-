package com.shareSphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiverId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private RefundStatus status;

    @OneToOne
    @JoinColumn(name = "exchange_id", nullable = false)
    private Exchange exchange;

    public enum RefundStatus {
        REQUESTED,
        APPROVED,
        REJECTED,
        PROCESSED
    }

}
