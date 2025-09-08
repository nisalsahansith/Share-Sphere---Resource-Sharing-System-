package com.shareSphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatSummaryDto {
    private UUID userId;
    private String username;
    private String exchangeId;
    private String lastMessage;
    private String lastMessageTime;
}
