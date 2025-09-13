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
public class Payout {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiverId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private BigDecimal commission;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PayoutStatus status;

    @OneToOne
    @JoinColumn(name = "exchange_id", nullable = false)
    private Exchange exchange;

    public enum PayoutStatus {
        PENDING,
        COMPLETED,
        FAILED,
        RELEASED
    }

}
