package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.ChatMessageDto;
import com.shareSphere.backend.entity.ChatMessage;
import com.shareSphere.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessageDto message) {
        if (message.getContent() != null) {
            return chatService.sendTextMessage(
                    message.getExchangeId(),
                    message.getSenderId(),
                    message.getReceiverId(),
                    message.getContent()
            );
        } else {
            return chatService.sendFileMessage(
                    message.getExchangeId(),
                    message.getSenderId(),
                    message.getReceiverId(),
                    message.getFileUrl(),
                    message.getFileType()
            );
        }
    }

    @MessageMapping("/chat.broadcast")
    @SendTo("/topic/messages")
    public ChatMessage broadcastMessage(ChatMessageDto message) {
        // Save & return
        return chatService.sendTextMessage(
                message.getExchangeId(),
                message.getSenderId(),
                message.getReceiverId(),
                message.getContent()
        );
    }


}
