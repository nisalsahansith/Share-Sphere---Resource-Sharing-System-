package com.shareSphere.backend.dto;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageDto {
    private Long messageId;
    private Long exchangeId;
    private String senderId;
    private String receiverId;
    private String content;
    private LocalDateTime timestamp;
}
