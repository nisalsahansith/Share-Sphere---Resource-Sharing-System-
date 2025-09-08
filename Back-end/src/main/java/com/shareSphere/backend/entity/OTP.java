package com.shareSphere.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OTP {
    @Id
    @GeneratedValue
    private Long id;

    private String email;
    private String otp;
    private LocalDateTime expiryTime;
}
