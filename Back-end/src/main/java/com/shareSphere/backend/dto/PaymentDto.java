package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.entity.Payment;
import com.shareSphere.backend.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentDto {
    private Long paymentId;
    private String payerId;
    private String receiverId;
    private String exchangeId;
    private double amount;
    private Payment.PaymentMethod paymentMethod;
    private Payment.PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private String transactionId;

}
