package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.entity.Refund;
import com.shareSphere.backend.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RefundDto {
    private String id;

    private BigDecimal amount;

    private User receiverId;

    private Refund.RefundStatus status;
    private Exchange exchange;

}
