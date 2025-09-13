package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.entity.Payout;
import com.shareSphere.backend.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PayOutDto {
    private String id;

    private String receiverId;

    private BigDecimal amount;

    private BigDecimal commission;

    private BigDecimal totalAmount;

    private Payout.PayoutStatus status;
    private String exchange;

}
